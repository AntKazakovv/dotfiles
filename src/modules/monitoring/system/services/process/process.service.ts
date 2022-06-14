/**
 * @description
 * Launch processes from src/modules/monitoring/system/config/process.config.ts for monitoring and logging errors.
 * See description in process.config.md.
 */

import {
    Inject,
    Injectable,
} from '@angular/core';
import {
    fromEvent,
    Subscription,
} from 'rxjs';

import _assign from 'lodash-es/assign';
import _each from 'lodash-es/each';
import _keys from 'lodash-es/keys';
import _map from 'lodash-es/map';
import _cloneDeep from 'lodash-es/cloneDeep';

import {WINDOW} from 'wlc-engine/modules/app/system';
import {
    ConfigService,
    EventService,
    IEvent,
    IIndexing,
    LogService,
    TLogObjFlog,
} from 'wlc-engine/modules/core';
import {
    comparatorMap,
    emptyLaunchedProcess,
    processConfigsCommon,
    ProcessEvents,
    ProcessEventsDescriptions,
} from 'wlc-engine/modules/monitoring/system/config/process.config';
import {
    ILaunchedProcess,
    ILaunchedProcessSubscription,
    IProcessConfig,
    IProcessConfigEvent,
    IProcessConfigGroup,
    IProcessEventData,
    IProcessExceptionConfigParam,
    IProcessExceptions,
    TProcessConfigs,
    TProcessSubscribeEvent,
} from 'wlc-engine/modules/monitoring/system/interfaces/process.interface';

interface ISingleEvent {
    event: IEvent<IProcessEventData>;
    exceptions?: IProcessExceptions;
}

interface IFlogData extends TLogObjFlog {
    processName?: string;
    description?: string;
}

const allEvents: TProcessSubscribeEvent[] = [
    'launch',
    'start',
    'fail',
    'success',
    'stop',
    'restart',
];

const afterStartEvents: TProcessSubscribeEvent[] = [
    'fail',
    'success',
    'stop',
    'restart',
];

@Injectable({
    providedIn: 'root',
})
export class ProcessService {
    protected launchedProcesses: IIndexing<ILaunchedProcess> = {};
    protected readonly processConfigs: TProcessConfigs;

    constructor(
        protected eventService: EventService,
        protected logService: LogService,
        protected configService: ConfigService,
        @Inject(WINDOW) protected window: Window,
    ) {
        this.processConfigs = this.getConfig();
        this.init();
    }

    protected init(): void {
        this.launchProcessesMonitoring();
        this.setEventListeners();
    }

    protected getConfig(): TProcessConfigs {
        const processConfigLocal = this.configService.get<TProcessConfigs>('$base.monitoring.processConfigs');
        const remoteConfig: TProcessConfigs = this.getRemoteConfig();
        return _cloneDeep<TProcessConfigs>(
            _assign({}, processConfigsCommon, remoteConfig, processConfigLocal),
        );
    }

    protected getRemoteConfig(): TProcessConfigs {
        const remoteConfig: TProcessConfigs = _cloneDeep(
            this.configService.get<TProcessConfigs>('appConfig.siteconfig.monitoring'),
        );
        if (!remoteConfig) {
            return null;
        }

        const replaceComparatorIdWithFunc = (obj: Object): void => {
            const keys: string[] = _keys(obj);
            if (!keys.length) {
                return;
            }
            _each(keys, (key: string): boolean => {
                if (key === 'use' && !obj[key]) {
                    return false;
                }
                if (key === 'comparator' && obj[key].id) {
                    obj[key] = comparatorMap[obj[key].id];
                    return false;
                }
                if (typeof obj[key] === 'object') {
                    replaceComparatorIdWithFunc(obj[key]);
                }
            });
            
        };
        replaceComparatorIdWithFunc(remoteConfig);
        return remoteConfig;
    }

    protected launchProcessesMonitoring(): void {
        _each(this.processConfigs, (config: IProcessConfig, processName: string): void => {
            if (!config?.use) { return; }

            if (
                !config.launch &&
                !config.launchOnAppStart &&
                !config.launchAfterTimer
            ) {
                console.warn('No launch trigger in process.config for process:', processName);
                return;
            }

            this.initEmptyLaunchedProcess(processName);

            if (config.launch) {
                this.createSubscriptionsByType(processName, 'launch');
            }
            if (config.launchOnAppStart) {
                this.launchProcess(processName);
            }
            if (config.launchAfterTimer) {
                this.createTimer(processName, ['launch']);
            }
        });
    }

    protected setEventListeners(): void {
        fromEvent(this.window, 'beforeunload')
            .subscribe((): void => {
                this.eventService.emit({
                    name: ProcessEvents.beforeunload,
                    data: <IProcessEventData>{
                        description: ProcessEventsDescriptions.beforeunload,
                    },
                });
            });
    }

    protected launchProcess(processName: string): void {
        if ((['launched', 'started']).includes(this.launchedProcesses[processName].status)) {
            return;
        }
        this.createSubscriptionsByType(processName, 'start');
        this.createTimer(processName, ['start']);
        this.launchedProcesses[processName].status = 'launched';
    }


    protected initEmptyLaunchedProcess(processName: string): void {
        if (this.launchedProcesses[processName]) {
            this.killLaunchedProcess(processName);
        }
        this.launchedProcesses[processName] = _cloneDeep(emptyLaunchedProcess);
        this.launchedProcesses[processName].status = 'created';
    }

    protected killLaunchedProcess(processName: string): void {
        this.unsubscribeSubscriptionsByTypes(processName, allEvents);
        this.stopTimer(processName, allEvents);
        delete this.launchedProcesses[processName];
    }

    protected createSubscriptionsByType(processName: string, type: TProcessSubscribeEvent): void {
        const process: ILaunchedProcess = this.launchedProcesses[processName];
        const triggers: ISingleEvent[] = this.getSingleEvents(this.processConfigs[processName][type]);

        process.subscriptions[type] = _map(triggers, (trigger: ISingleEvent): ILaunchedProcessSubscription => {
            const subscription: Subscription = this.eventService.subscribe(
                {name: trigger.event.name},
                (data: IProcessEventData): void => {
                    if (
                        this.checkTriggerEventData(trigger.event, data) &&
                        this.checkTriggerConfigExceptions(processName, trigger.exceptions)
                    ) {
                        this.triggerProcess(processName, type, data?.description || trigger.event.data?.description);
                    }
                },
            );
            let result: ILaunchedProcessSubscription = {
                subscription,
            };

            // Subscribe for trigger event exception
            if (trigger.exceptions?.events?.length) {
                const exceptSubscription: Subscription = this.eventService.subscribe(
                    trigger.exceptions.events,
                    (): void => {
                        process.subscriptions[type] = process.subscriptions[type].filter(
                            (s: ILaunchedProcessSubscription): boolean => s.subscription !== subscription,
                        );
                        subscription.unsubscribe();
                        exceptSubscription.unsubscribe();
                    });
                result.exceptionsSubscription = exceptSubscription;
            }

            return result;
        });
    }

    protected getSingleEvents(configGroup: IProcessConfigGroup): ISingleEvent[] {
        const events: ISingleEvent[] = [];
        _each(configGroup?.triggers, (trigger: IEvent<IProcessEventData> | IProcessConfigEvent): void => {
            const exceptions: IProcessExceptions = {
                events: [],
                configParams: [],
            };
            // Collecting group exceptions
            if (configGroup.exceptionsForGroup?.events?.length) {
                exceptions.events.push(...configGroup.exceptionsForGroup.events);
            }
            if (configGroup.exceptionsForGroup?.configParams?.length) {
                exceptions.configParams.push(...configGroup.exceptionsForGroup.configParams);
            }

            if ('events' in trigger) {
                // Collecting trigger exceptions
                if (trigger.exceptions?.events?.length) {
                    exceptions.events.push(...trigger.exceptions.events);
                }
                if (trigger.exceptions?.configParams?.length) {
                    exceptions.configParams.push(...trigger.exceptions.configParams);
                }
                _each(trigger.events, (event: IEvent<IProcessEventData>): void => {
                    events.push({
                        event,
                        exceptions,
                    });
                });
            } else {
                events.push({
                    event: trigger,
                    exceptions,
                });
            }
        });
        return events;
    }

    /**
     * Compare trigger event data from config with emitted event data (if present).
     * By default compare by eventId.
     * @returns true - if emitted event fits event from config
     */
    protected checkTriggerEventData(trigger: IEvent<IProcessEventData>, data: IProcessEventData): boolean {
        if (!trigger.data) { return true; }
        return trigger.data.comparator ? 
            trigger.data.comparator(trigger.data, data) :
            trigger.data.eventId === data?.eventId;
    }

    /**
     * Returns true if there is no exceptions for event
     * By default compare params as booleans
     */
    protected checkTriggerConfigExceptions(processName: string, exceptions: IProcessExceptions): boolean {
        const configException: boolean = exceptions?.configParams?.some(
            (config: IProcessExceptionConfigParam): boolean => {
                return config.comparator ?
                    config.comparator(this.configService.get(config.param)) :
                    this.configService.get<boolean>(config.param);
            });
        return !configException;
    }

    protected createTimer(processName: string, types: TProcessSubscribeEvent[]): void {
        _each(types, (type: TProcessSubscribeEvent): void => {
            const ms: number = this.processConfigs[processName]?.[`${type}AfterTimer`];
            if (Number.isFinite(ms)) {
                const timer: ReturnType<typeof setTimeout> = setTimeout((): void => {
                    if (this.checkTriggerConfigExceptions(
                        processName,
                        this.processConfigs[processName][type]?.exceptionsForGroup,
                    )) {
                        this.triggerProcess(processName, type, 'timer');
                    }
                }, ms);
                this.launchedProcesses[processName].timers[type].push(timer);
            }
        });
    }

    protected stopTimer(processName: string, types: TProcessSubscribeEvent[]): void {
        _each(types, (type: TProcessSubscribeEvent): void => {
            _each(this.launchedProcesses[processName].timers[type], (timer: number): void => {
                clearTimeout(timer);
            });
        });
    }

    protected triggerProcess(
        processName: string,
        type: TProcessSubscribeEvent,
        description: string,
    ): void {
        switch (type) {
            case 'launch':
                this.launchProcess(processName);
                break;
            case 'start':
                this.startProcess(processName, description);
                break;
            case 'success':
                this.successProcess(processName, description);
                break;
            case 'fail':
                this.failProcess(processName, description);
                break;
            case 'stop':
                this.stopProcess(processName, description);
                break;
            case 'restart':
                this.restartProcess(processName, description);
                break;
            default:
                break;
        }
    };

    protected startProcess(processName: string, description: string): void {
        if (this.launchedProcesses[processName].status !== 'launched') {
            return;
        }
        this.launchedProcesses[processName].status = 'started';
        this.sendLog('18.0.0', {processName, description});

        this.unsubscribeSubscriptionsByTypes(processName, ['start']);
        this.stopTimer(processName, ['start']);

        _each(afterStartEvents, (event: TProcessSubscribeEvent) => {
            this.createSubscriptionsByType(processName, event);
        });

        this.createTimer(processName, afterStartEvents);
    }
    
    protected unsubscribeSubscriptionsByTypes(processName: string, types: TProcessSubscribeEvent[]): void {
        _each(types, (type: TProcessSubscribeEvent): void => {
            _each(
                this.launchedProcesses[processName]?.subscriptions[type],
                (s: ILaunchedProcessSubscription): void => {
                    s.subscription.unsubscribe();
                    s.exceptionsSubscription?.unsubscribe();
                },
            );
        });
    }

    protected failProcess(processName: string, description: string): void {
        if (this.launchedProcesses[processName].status !== 'started') {
            return;
        }
        this.launchedProcesses[processName].status = 'failed';
        this.unsubscribeSubscriptionsByTypes(processName, afterStartEvents);
        this.stopTimer(processName, afterStartEvents);

        this.sendLog('18.0.2', {processName, description});

        if (this.processConfigs[processName].relaunchAfterFail){
            this.launchProcess(processName);
        }
    }

    protected successProcess(processName: string, description: string): void {
        if (this.launchedProcesses[processName].status !== 'started') {
            return;
        }
        this.launchedProcesses[processName].status = 'succeed';
        this.unsubscribeSubscriptionsByTypes(processName, afterStartEvents);
        this.stopTimer(processName, afterStartEvents);

        this.sendLog('18.0.1', {processName, description});

        if (this.processConfigs[processName].relaunchAfterSuccess){
            this.launchProcess(processName);
        }
    }

    protected stopProcess(processName: string, description: string): void {
        if (this.launchedProcesses[processName].status !== 'started') {
            return;
        }
        this.launchedProcesses[processName].status = 'stopped';
        this.unsubscribeSubscriptionsByTypes(processName, afterStartEvents);
        this.stopTimer(processName, afterStartEvents);

        this.sendLog('18.0.3', {processName, description});

        if (this.processConfigs[processName].relaunchAfterStop) {
            this.launchProcess(processName);
        }
    }

    protected restartProcess(processName: string, description: string): void {
        if (this.launchedProcesses[processName].status !== 'started') {
            return;
        }
        this.launchedProcesses[processName].status = 'stopped';
        this.unsubscribeSubscriptionsByTypes(processName, afterStartEvents);
        this.stopTimer(processName, afterStartEvents);

        this.sendLog('18.0.4', {processName, description});

        this.launchProcess(processName);
        this.startProcess(processName, ProcessEventsDescriptions.restartTrigger + description);
    }

    protected sendLog(code: string, flog: IFlogData): void {
        this.logService.sendLog({
            code,
            flog,
        });
    }
}
