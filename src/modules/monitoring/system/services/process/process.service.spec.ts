import {Injectable} from '@angular/core';
import {
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';

import {WINDOW_PROVIDER} from 'wlc-engine/modules/app/system';
import {
    ConfigService,
    EventService,
    IIndexing,
    LogService,
} from 'wlc-engine/modules/core';
import {
    IProcessConfig,
    IProcessEventData,
} from 'wlc-engine/modules/monitoring';
import {ProcessService} from './process.service';

const TIMER_TIME: number = 1;

enum events {
    launch = 'launch',
    launchGroupException = 'launch-group-exception',
    launchTriggerException = 'launch-trigger-exception',

    start = 'start',
    startGroupException = 'start-group-exception',
    startTriggerException = 'start-trigger-exception',

    success = 'success',
    successGroupException = 'success-group-exception',
    successTriggerException = 'success-trigger-exception',

    fail = 'fail',
    failGroupException = 'fail-group-exception',
    failTriggerException = 'fail-trigger-exception',

    stop = 'stop',
    stopGroupException = 'stop-group-exception',
    stopTriggerException = 'stop-trigger-exception',

    restart = 'restart',
};

const processConfigsMock: IIndexing<IProcessConfig> = {
    'simple config': {
        use: true,
        launch: {
            triggers: [{name: events.launch}],
        },
        start: {
            triggers: [{name: events.start}],
        },
        fail: {
            triggers: [{name: events.fail}],
        },
        success: {
            triggers: [{name: events.success}],
        },
        stop: {
            triggers: [{name: events.stop}],
        },
        restart: {
            triggers: [{name: events.restart}],
        },
    },
    'simple config with event exceptions': {
        use: true,
        launch: {
            triggers: [
                {
                    events: [{name: events.launch}],
                    exceptions: {
                        events: [{name: events.launchTriggerException}],
                    },
                },
            ],
            exceptionsForGroup: {
                events: [{name: events.launchGroupException}],
            },
        },
        start: {
            triggers: [
                {
                    events: [{name: events.start}],
                    exceptions: {
                        events: [{name: events.startTriggerException}],
                    },
                },
            ],
            exceptionsForGroup: {
                events: [{name: events.startGroupException}],
            },
        },
        fail: {
            triggers: [
                {
                    events: [{name: events.fail}],
                    exceptions: {
                        events: [{name: events.failTriggerException}],
                    },
                },
            ],
            exceptionsForGroup: {
                events: [{name: events.failGroupException}],
            },
        },
        success: {
            triggers: [
                {
                    events: [{name: events.success}],
                    exceptions: {
                        events: [{name: events.successTriggerException}],
                    },
                },
            ],
            exceptionsForGroup: {
                events: [{name: events.successGroupException}],
            },
        },
        stop: {
            triggers: [
                {
                    events: [{name: events.stop}],
                    exceptions: {
                        events: [{name: events.stopTriggerException}],
                    },
                },
            ],
            exceptionsForGroup: {
                events: [{name: events.stopGroupException}],
            },
        },
    },
    'launch with config group exceptions': {
        use: true,
        launch: {
            triggers: [{events: [{name: events.launch}]}],
            exceptionsForGroup: {
                configParams: [{param: 'launchConfigException'}],
            },
        },
    },
    'launch with config trigger exceptions': {
        use: true,
        launch: {
            triggers: [
                {
                    events: [{name: events.launch}],
                    exceptions: {
                        configParams: [{param: 'launchConfigException'}],
                    },
                },
            ],
        },
    },
    'start with config group exceptions': {
        use: true,
        launch: {
            triggers: [{name: events.launch}],
        },
        start: {
            triggers: [{
                events: [{name: events.start}],
            }],
            exceptionsForGroup: {
                configParams: [{param: 'startConfigException'}],
            },
        },
    },
    'start with config trigger exceptions': {
        use: true,
        launch: {
            triggers: [{name: events.launch}],
        },
        start: {
            triggers: [
                {
                    events: [{name: events.start}],
                    exceptions: {
                        configParams: [{param: 'startConfigException'}],
                    },
                },
            ],
        },
    },
    'success with config group exceptions': {
        use: true,
        launch: {
            triggers: [{name: events.launch}],
        },
        start: {
            triggers: [{name: events.start}],
        },
        success: {
            triggers: [
                {
                    events: [{name: events.success}],
                },
            ],
            exceptionsForGroup: {
                configParams: [{param: 'successConfigException'}],
            },
        },
    },
    'success with config trigger exceptions': {
        use: true,
        launch: {
            triggers: [{name: events.launch}],
        },
        start: {
            triggers: [{name: events.start}],
        },
        success: {
            triggers: [
                {
                    events: [{name: events.success}],
                    exceptions: {
                        configParams: [{param: 'successConfigException'}],
                    },
                },
            ],
        },
    },
    'success with config group exceptions with comparator': {
        use: true,
        launch: {
            triggers: [{name: events.launch}],
        },
        start: {
            triggers: [{name: events.start}],
        },
        success: {
            triggers: [
                {
                    events: [{name: events.success}],
                },
            ],
            exceptionsForGroup: {
                configParams: [
                    {
                        param: '2',
                        comparator: (arg) => Number(arg) % 2 === 0,
                    },
                ],
            },
        },
    },
    'check use': {
        use: false,
        launchOnAppStart: true,
    },
    'check launchOnAppStart': {
        use: true,
        launchOnAppStart: true,
    },
    'check relaunch': {
        use: true,
        launch: {
            triggers: [{name: events.launch}],
        },
        start: {
            triggers: [{name: events.start}],
        },
        fail: {
            triggers: [{name: events.fail}],
        },
        relaunchAfterFail: true,
        success: {
            triggers: [{name: events.success}],
        },
        relaunchAfterSuccess: true,
        stop: {
            triggers: [{name: events.stop}],
        },
        relaunchAfterStop: true,
    },
    'check timers': {
        use: true,
        launchAfterTimer: 1,
        startAfterTimer: 1,
        successAfterTimer: 1,
    },
    'success with event data comparator': {
        use: true,
        launch: {
            triggers: [{name: events.launch}],
        },
        start: {
            triggers: [{name: events.start}],
        },
        success: {
            triggers: [
                {
                    events: [{
                        name: events.success,
                        data: {
                            eventId: 'test',
                            comparator: (triggerData: any, eventData: any) => {
                                return triggerData.eventId[0] === eventData?.eventId[3];
                            },
                        },
                    }],
                },
            ],
        },
    },
};

@Injectable()
class ProcessServiceMock extends ProcessService {
    override getConfig(): any {
        return processConfigsMock;
    }
}

describe('ProcessService', () => {
    let service: ProcessService;
    let eventService: EventService;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;
    let logServiceSpy: jasmine.SpyObj<LogService>;

    beforeEach(() => {
        logServiceSpy = jasmine.createSpyObj('LogService', ['sendLog']);
        const configServiceConstructorSpy = jasmine.createSpyObj('ConfigService', ['get']);

        TestBed.configureTestingModule({
            providers: [
                EventService,
                ProcessServiceMock,
                {provide: LogService, useValue: logServiceSpy},
                {provide: ConfigService, useValue: configServiceConstructorSpy},
                WINDOW_PROVIDER,
            ],
        });
        service = TestBed.inject(ProcessServiceMock);
        eventService = TestBed.inject(EventService);
        configServiceSpy = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    });

    it('-> should launch', fakeAsync(() => {
        eventService.emit({name: events.launch});
        tick();
        expect(service['launchedProcesses']['simple config'].status).toBe('launched');
    }));

    it('-> should start', fakeAsync(() => {
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        tick();
        expect(service['launchedProcesses']['simple config'].status).toBe('started');
        expect(logServiceSpy.sendLog).toHaveBeenCalledWith(jasmine.objectContaining({code: '18.0.0'}));
    }));

    it('-> should success', fakeAsync(() => {
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        eventService.emit({name: events.success});
        tick();
        expect(service['launchedProcesses']['simple config'].status).toBe('succeed');
        expect(logServiceSpy.sendLog).toHaveBeenCalledWith(jasmine.objectContaining({code: '18.0.1'}));
    }));

    it('-> should not success with group event exception', fakeAsync(() => {
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        eventService.emit({name: events.successGroupException});
        eventService.emit({name: events.success});
        tick();
        expect(service['launchedProcesses']['simple config with event exceptions'].status).toBe('started');
    }));
    it('-> should not success with trigger event exception', fakeAsync(() => {
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        eventService.emit({name: events.successTriggerException});
        eventService.emit({name: events.success});
        tick();
        expect(service['launchedProcesses']['simple config with event exceptions'].status).toBe('started');
    }));

    it('-> should not success with truthy group config exception', fakeAsync(() => {
        configServiceSpy.get.and.returnValue(true);
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        eventService.emit({name: events.success});
        tick();
        expect(configServiceSpy.get).toHaveBeenCalledWith('successConfigException');
        expect(service['launchedProcesses']['success with config group exceptions'].status).toBe('started');
    }));
    it('-> should success with falsy group config exception', fakeAsync(() => {
        configServiceSpy.get.and.returnValue(false);
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        eventService.emit({name: events.success});
        tick();
        expect(configServiceSpy.get).toHaveBeenCalledWith('successConfigException');
        expect(service['launchedProcesses']['success with config group exceptions'].status).toBe('succeed');
    }));
    it('-> should not success with truthy trigger config exception', fakeAsync(() => {
        configServiceSpy.get.and.returnValue(true);
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        eventService.emit({name: events.success});
        tick();
        expect(configServiceSpy.get).toHaveBeenCalledWith('successConfigException');
        expect(service['launchedProcesses']['success with config trigger exceptions'].status).toBe('started');
    }));
    it('-> should success with falsy trigger config exception', fakeAsync(() => {
        configServiceSpy.get.and.returnValue(false);
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        eventService.emit({name: events.success});
        tick();
        expect(configServiceSpy.get).toHaveBeenCalledWith('successConfigException');
        expect(service['launchedProcesses']['success with config trigger exceptions'].status).toBe('succeed');
    }));
    it('-> should not success with truthy group config exception with comparator', fakeAsync(() => {
        configServiceSpy.get.and.returnValue('2');
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        eventService.emit({name: events.success});
        tick();
        expect(configServiceSpy.get).toHaveBeenCalledWith('2');
        expect(service['launchedProcesses']['success with config group exceptions with comparator'].status)
            .toBe('started');
    }));
    it('-> should success with false group config exception with comparator', fakeAsync(() => {
        configServiceSpy.get.and.returnValue('3');
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        eventService.emit({name: events.success});
        tick();
        expect(configServiceSpy.get).toHaveBeenCalledWith('2');
        expect(service['launchedProcesses']['success with config group exceptions with comparator'].status)
            .toBe('succeed');
    }));

    it('-> should fail', fakeAsync(() => {
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        eventService.emit({name: events.fail});
        tick();
        expect(service['launchedProcesses']['simple config'].status).toBe('failed');
        expect(logServiceSpy.sendLog).toHaveBeenCalledWith(jasmine.objectContaining({code: '18.0.2'}));
    }));

    it('-> should stop', fakeAsync(() => {
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        eventService.emit({name: events.stop});
        tick();
        expect(service['launchedProcesses']['simple config'].status).toBe('stopped');
    }));

    it('-> should restart', fakeAsync(() => {
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        eventService.emit({name: events.restart});
        tick();
        expect(logServiceSpy.sendLog).toHaveBeenCalledWith(jasmine.objectContaining({code: '18.0.4'}));
        expect(service['launchedProcesses']['simple config'].status).toBe('started');
        expect(logServiceSpy.sendLog).toHaveBeenCalledWith(jasmine.objectContaining({code: '18.0.0'}));
    }));

    it('-> should not launch with flag use = false', () => {
        expect(service['launchedProcesses']['check use']).toBeUndefined();
    });
    it('-> should launch by flag "launchOnAppStart"', () => {
        expect(service['launchedProcesses']['check launchOnAppStart'].status).toBe('launched');
    });

    it('-> should relaunch after fail', fakeAsync(() => {
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        eventService.emit({name: events.fail});
        tick();
        expect(service['launchedProcesses']['check relaunch'].status).toBe('launched');
    }));
    it('-> should relaunch after success', fakeAsync(() => {
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        eventService.emit({name: events.success});
        tick();
        expect(service['launchedProcesses']['check relaunch'].status).toBe('launched');
    }));
    it('-> should relaunch after stop', fakeAsync(() => {
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        eventService.emit({name: events.stop});
        tick();
        expect(service['launchedProcesses']['check relaunch'].status).toBe('launched');
    }));

    it('-> should launch, start and success by timers', (done) => {
        expect(service['launchedProcesses']['check timers'].status).toBe('created');

        setTimeout(() => {
            expect(service['launchedProcesses']['check timers'].status).toBe('launched');
            setTimeout(() => {
                expect(service['launchedProcesses']['check timers'].status).toBe('started');
                setTimeout(() => {
                    expect(service['launchedProcesses']['check timers'].status).toBe('succeed');
                    expect(logServiceSpy.sendLog).toHaveBeenCalledWith(jasmine.objectContaining({code: '18.0.1'}));
                    done();
                }, TIMER_TIME);
            }, TIMER_TIME);
        }, TIMER_TIME);
    });

    it('-> should success with truthy event data comparator', fakeAsync(() => {
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        eventService.emit({
            name: events.success,
            data: <IProcessEventData>{
                eventId: 'test',
            },
        });
        tick();
        expect(service['launchedProcesses']['success with event data comparator'].status).toBe('succeed');
    }));
    it('-> should not success with false event data comparator', fakeAsync(() => {
        eventService.emit({name: events.launch});
        eventService.emit({name: events.start});
        eventService.emit({
            name: events.success,
            data: <IProcessEventData>{
                eventId: 'wrong-data',
            },
        });
        tick();
        expect(service['launchedProcesses']['success with event data comparator'].status).toBe('started');
    }));
});
