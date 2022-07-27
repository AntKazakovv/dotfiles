import {Injectable} from '@angular/core';
import {DateTime} from 'luxon';
import {BehaviorSubject, timer, Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {ILimitationExclusion} from 'wlc-engine/modules/core/system/interfaces';
import {IPushMessageParams} from 'wlc-engine/modules/core/system/services/notification/notification.interface';
import {NotificationEvents} from 'wlc-engine/modules/core/system/services/notification/notification.service';
import {DataService} from 'wlc-engine/modules/core/system/services/data/data.service';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';

import _isArray from 'lodash-es/isArray';

export interface ISelfExclusion {
    Currency: string;
    LimitsDate: string;
    MaxDepositSumDay?: string;
    MaxDepositSumWeek?: string;
    MaxDepositSumMonth?: string;
    MaxBetSumDay?: string;
    MaxBetSumWeek?: string;
    MaxBetSumMonth?: string;
    MaxLossSumDay?: string;
    MaxLossSumWeek?: string;
    MaxLossSumMonth?: string;
}

export interface ISelfExclusionData extends IData {
    data: ISelfExclusion;
}

export interface IRealityCheckerResult {
    FromTime?: string;
    Deposits?: number;
    Losses?: number;
    Wins?: number;
}

export type TResponseType = 'already' | 'queue' | 'immediately';

/**
 * Self exclusion's data to sending with "single" query parameter.
 * This parameter is allowed to get additional information about self exlusions.
 */
export interface ISelfExclusionSingleData {
    /**
     * Type of response when setting a limit.
     * 'already' - if the value of the set limit has not changed.
     * 'queue' - if the limit is queued.
     * 'immediately' - if the limit installed successfully.
     */
    type?: TResponseType;
    /**
     * Number of response status.
     */
    status: number;
    /**
     * Message of response.
     */
    message: string;
    /**
     * Date when the limit will be applied.
     */
    date: string;
}

@Injectable({
    providedIn: 'root',
})
export class LimitationService {

    private checkPeriod: number;
    private loginTime: number;
    private lastCheck: number;
    private intervalChecker: Subscription;

    constructor(
        private dataService: DataService,
        private configService: ConfigService,
        private eventService: EventService,
        private modalService: ModalService,
    ) {
        this.registerMethod();
    }

    /**
     * Start Reality Checker
     *
     * @param userProfile$ {BehaviorSubject<UserProfile>} BehaviorSubject of userProfile from UserService
     * @param force {Boolean} force set realityCheckerTime
     *
     * @return {Promise}
     */
    public async initRealityChecker(userProfile$: BehaviorSubject<UserProfile>, force?: boolean): Promise<void> {
        if (this.configService.get<boolean>('$base.profile.limitations.use')) {
            userProfile$.pipe(filter((v) => !!v)).subscribe((userProfile) => {
                this.checkPeriod = (parseInt(userProfile.extProfile.realityCheckTime) || 30) * 60 * 1000;
            });

            this.loginTime = this.configService.get<number>({
                name: 'realityCheckerTime',
                storageType: 'sessionStorage',
            });

            if (!this.loginTime || force) {
                this.loginTime = DateTime.now().toUTC().toMillis();
                this.configService.set({
                    name: 'realityCheckerTime',
                    value: this.loginTime,
                    storageType: 'sessionStorage',
                });
            }

            this.lastCheck = this.configService.get<number>({
                name: 'realityLastCheckTime',
                storageType: 'sessionStorage',
            });

            if (!this.lastCheck) {
                this.lastCheck = this.loginTime;
                this.configService.set<number>({
                    name: 'realityLastCheckTime',
                    storageType: 'sessionStorage',
                    value: this.lastCheck,
                });
            }

            this.eventService.subscribe({name: 'LOGOUT'}, () => {
                this.intervalChecker?.unsubscribe();
                this.configService.set<number>({
                    name: 'realityLastCheckTime',
                    storageType: 'sessionStorage',
                    value: null,
                });
                this.configService.set<number>({
                    name: 'realityCheckerTime',
                    storageType: 'sessionStorage',
                    value: null,
                });
            });

            this.intervalChecker = timer(0, 60000).subscribe(() => {
                this.processRealityCheck();
            });
        }
    }

    /**
     * Get user activity result
     *
     * @param from {Number} time in milliseconds
     *
     * @return {Promise}
     */
    public async getRealityCheck(from: number): Promise<IRealityCheckerResult> {
        try {
            const result = await this.dataService.request<IData>('limit/realityCheck', {
                from: DateTime.fromMillis(from).toUTC().toFormat('yyyy-LL-dd HH:mm:ss'),
            });
            return result.data;
        } catch (error) {
            //
        }
    }

    /**
     * Get user self exclusion
     *
     * @return {Promise}
     */
    public async getUserSelfExclusion(): Promise<ISelfExclusion> {
        try {
            const result = await this.dataService
                .request<ISelfExclusionData>('limit/getExclusion') as ISelfExclusionData;
            return result.data;
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Error'),
                    message: gettext('Error getting user self exclusion'),
                    wlcElement: 'notification_get-self-exclusion-error',
                },
            });
        }
    }

    /**
     * Set user self exclusion
     *
     * @param exclusion {IIndexing<number>} object with types of user self exclusion
     *
     * @return {Promise}
     */
    public async setUserSelfExclusion(exclusion: ILimitationExclusion): Promise<void> {
        const params = {[`${exclusion.type}`]: exclusion.value};
        try {
            const result: IData<ISelfExclusionSingleData> = await this.dataService
                .request('limit/setExclusion', params);
            if (result.data?.type === 'queue') {
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'success',
                        title: gettext('User Limits'),
                        message: (exclusion.value
                            ? gettext('The limit was successfully added and will be applied on')
                            : gettext('The limit will be removed on')),
                        messageContext: {
                            time: DateTime.local().plus({days: 1}).toFormat('LL.dd.yyyy'),
                        },
                        wlcElement: 'notification_set-self-exclusion-info',
                    },
                });
            } else if (result.status === 'success')  {
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'success',
                        title: gettext('Profile updated successfully'),
                        message: gettext('Your profile has been updated successfully'),
                        wlcElement: 'notification_profile-update-success',
                    },
                });
            }
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Profile update failed'),
                    message: gettext('Mismatch with previously selected limitations'),
                    wlcElement: 'notification_set-self-exclusion-error',
                },
            });
        }
    }

    /**
     * Remove user self exclusion
     *
     * @param type {string} type of exclusion, if not set - remove all
     *
     * @return {Promise}
     */
    public async removeUserSelfExclusion(type?: string): Promise<void> {
        try {
            if (type) {
                await this.setUserSelfExclusion({
                    type: type,
                    value: 0,
                });
            } else {
                await this.dataService.request('limit/removeExclusion');
            }
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Error'),
                    message: gettext('Error remove user self exclusion'),
                    wlcElement: 'notification_remove-self-exclusion-error',
                },
            });
        } finally {
            this.eventService.emit({name: 'remove_exclusion'});
        }
    }

    /**
     * User self locked account
     *
     * @param days {number} number of days to lock account
     *
     * @return {Promise}
     */
    public async userSelfDisable(days: number): Promise<void> {
        const date = DateTime.now().plus({days});
        await this.dataService.request({
            name: 'userSelfDisable',
            system: 'limit',
            url: `/profiles/disable?dateTo=${date.toUTC().toSQL({includeOffset: false})}`,
            type: 'PUT',
        });
        this.eventService.emit({name: 'USER_STATUS_DISABLE'});
    }

    /**
     * Process reality check
     *
     * @return {Promise}
     */
    protected async processRealityCheck(): Promise<void> {
        const now = DateTime.now().toMillis();
        if (now > (this.lastCheck + this.checkPeriod)) {
            const result = await this.getRealityCheck(this.loginTime);
            this.intervalChecker?.unsubscribe();
            this.intervalChecker = null;
            this.modalService.showModal({
                id: 'reality-check-info',
                modalTitle: gettext('Reality check!'),
                withoutPadding: true,
                componentName: 'user.wlc-reality-check-info',
                componentParams: {
                    ...result,
                },
                closeBtnVisibility: true,
                showFooter: false,
                onModalHidden: () => {
                    if (!this.intervalChecker && this.configService.get<boolean>('$user.isAuthenticated')) {
                        this.configService.set<number>({
                            name: 'realityLastCheckTime',
                            storageType: 'sessionStorage',
                            value: null,
                        });
                        this.configService.set<number>({
                            name: 'realityCheckerTime',
                            storageType: 'sessionStorage',
                            value: null,
                        });
                        this.loginTime = DateTime.now().toMillis();
                        this.intervalChecker = timer(60000, 60000).subscribe(() => {
                            this.processRealityCheck();
                        });
                    }
                    this.lastCheck = DateTime.now().toMillis();
                    this.configService.set<number>({
                        name: 'realityLastCheckTime',
                        storageType: 'sessionStorage',
                        value: this.lastCheck,
                    });
                },
            });
        }
    }

    private registerMethod(): void {
        this.dataService.registerMethod({
            name: 'getExclusion',
            url: '/userSelfExclusion',
            type: 'GET',
            system: 'limit',
            mapFunc: this.mapFunc,
            // events: {
            //     success: 'SELF_EXCLUSION',
            //     fail: 'SELF_EXCLUSION_ERROR',
            // },
        });
        this.dataService.registerMethod({
            name: 'setExclusion',
            params: {
                single: 1,
            },
            type: 'POST',
            system: 'limit',
            url: '/userSelfExclusion',
        });

        this.dataService.registerMethod({
            name: 'removeExclusion',
            url: '/userSelfExclusion',
            type: 'DELETE',
            system: 'limit',
        });

        this.dataService.registerMethod({
            name: 'realityCheck',
            url: '/realityCheck',
            type: 'GET',
            system: 'limit',
            mapFunc: this.mapFunc,
        });
    }

    private mapFunc(data: unknown): unknown {
        if (_isArray(data) && data.length === 1) {
            return data[0];
        }
        return data;
    }
}
