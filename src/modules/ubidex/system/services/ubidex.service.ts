import {Injectable} from '@angular/core';
import {
    BehaviorSubject,
    first,
    firstValueFrom,
} from 'rxjs';

import _merge from 'lodash-es/merge';

import {
    ConfigService,
    DataService,
    EventService,
    IIndexing,
    LogService,
    ModalService,
} from 'wlc-engine/modules/core';
import {IUbidexConfig} from 'wlc-engine/modules/ubidex/system/interfaces/ubidex.interface';
import {UserInfo} from 'wlc-engine/modules/user';
import {
    ProcessEvents,
} from 'wlc-engine/modules/monitoring/system/config/process.config';
import {IProcessEventData} from 'wlc-engine/modules/monitoring';

@Injectable({
    providedIn: 'root',
})
export class UbidexService {
    private uid: string | null = null;
    private ubidexConfig: IUbidexConfig | undefined;
    private isAuth: boolean = false;

    constructor(
        protected configService: ConfigService,
        protected dataService: DataService,
        protected eventService: EventService,
        protected logService: LogService,
        protected modalService: ModalService,
    ) {
        this.init();
    }

    private async init(): Promise<void> {
        await this.configService.ready;
        this.ubidexConfig = this.configService.get<IUbidexConfig>('$base.ubidex');

        this.prepareEventsConfig();
        this.checkAuth();
        this.setSubscriptions();
    }

    private prepareEventsConfig(): void {
        this.ubidexConfig.eventsMap = _merge({
            'visit': ['VISIT'],
            'regstarted': [
                'REGISTRATION_ERROR',
                'REGISTRATION_CONFIRM_ERROR',
                'PROFILE_CREATE_ERROR',
                'REG_INTERRUPT',
            ],
            'regfinished': ['REGISTRATION_COMPLETE'],
            'login': ['LOGIN'],
            'other': ['DEPOSIT_VISIT'],
        }, this.configService.get<IIndexing<string[]>>('$base.ubidex.eventsMap'));
    }

    private async getUserId(): Promise<string> {
        const userInfo: UserInfo = await firstValueFrom(
            this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
                .pipe(
                    first((userInfo: UserInfo): boolean => !!userInfo?.idUser),
                ),
        );
        return userInfo.idUser;
    }

    private async checkAuth(): Promise<void> {
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');

        if (this.isAuth) {
            this.uid = await this.getUserId();
        }
    }

    private async setSubscriptions(): Promise<void> {
        const {eventsMap} = this.ubidexConfig;

        for (let ubidexKey in eventsMap) {
            eventsMap[ubidexKey].forEach((eventName: string) => {
                if (!this.isAuth && eventName === 'VISIT') {
                    this.sendUserEvent(ubidexKey);
                    return;
                }

                switch (ubidexKey) {
                    case 'login':
                    case 'regfinished':
                    case 'other':
                        this.eventService.subscribe({name: eventName}, async () => {
                            if (!this.uid) {
                                this.uid = await this.getUserId();
                                this.isAuth = true;
                            }
                            this.sendUserEvent(ubidexKey);
                        });
                        break;

                    case 'regstarted':
                        if (eventName === 'REG_INTERRUPT') {
                            this.eventService.subscribe({
                                name: ProcessEvents.modalClosed,
                            }, (data: IProcessEventData) => {
                                if (data.eventId === 'signup' && data.description !== 'success') {
                                    this.sendUserEvent(ubidexKey);
                                }
                            });

                            this.eventService.subscribe({name: ProcessEvents.beforeunload}, () => {
                                if (this.modalService.getActiveModal('signup')) {
                                    this.sendUserEvent(ubidexKey);
                                }
                            });
                            break;
                        }

                        this.eventService.subscribe({name: eventName}, () => {
                            this.sendUserEvent(ubidexKey);
                        });
                        break;

                    default:
                        this.eventService.subscribe({name: eventName}, () => {
                            this.sendUserEvent(ubidexKey);
                        });
                        break;
                }
            });
        }

        this.eventService.subscribe({name: 'LOGOUT'}, () => {
            this.uid = null;
            this.isAuth = false;
        });
    }

    private async sendUserEvent(event: string): Promise<void> {
        const params = {event, uid: this.uid};

        try {
            await this.dataService.request({
                name: 'sendUbidexData',
                system: 'ubidex',
                url: '/ubidexData',
                type: 'POST',
            }, params);
        } catch (error) {
            this.logService.sendLog({
                code: '7.0.1', // Error - empty data
                flog: {
                    error,
                },
            });
        }
    }
}
