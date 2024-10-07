import {Injectable} from '@angular/core';

import {
    timer,
    Subscription,
    BehaviorSubject,
} from 'rxjs';
import {filter} from 'rxjs/operators';
import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import _isArray from 'lodash-es/isArray';
import _isObject from 'lodash-es/isObject';
import _find from 'lodash-es/find';
import _isString from 'lodash-es/isString';

import {
    ConfigService,
    ModalService,
    EventService,
    DataService,
    IData,
    ILimitationExclusion,
    IPushMessageParams,
    NotificationEvents,
    InjectionService,
    IIndexing,
} from 'wlc-engine/modules/core';

import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {
    IActivityResult,
    IActivityResultData,
    IResultSelfExclusion,
    TLimitationType,
} from 'wlc-engine/modules/user/submodules/limitations/system/interfaces/limitations.interface';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {TUserLimitationStatus} from 'wlc-engine/modules/user/system/interfaces/user.interface';
import {ActivityResultModel} from 'wlc-engine/modules/user/submodules/limitations/system/models/activity-result.model';
import {IMGAConfig} from 'wlc-engine/modules/core/components/license/license.params';

export interface ISelfExclusion {
    Currency: string;
    LimitsDate: string;
    CoolOffTime?: string;
    ZeroLimits: boolean;
    MaxDepositSumDay?: string;
    MaxDepositSumWeek?: string;
    MaxDepositSumMonth?: string;
    MaxBetSumDay?: string;
    MaxBetSumWeek?: string;
    MaxBetSumMonth?: string;
    MaxLossSumDay?: string;
    MaxLossSumWeek?: string;
    MaxLossSumMonth?: string;
    UserStatus?: TUserLimitationStatus;
}

export interface ISelfExclusionData extends IData {
    data: ISelfExclusion;
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
    private useRealityCheck: boolean = false;
    private userService: UserService;
    private userStatus$: BehaviorSubject<TUserLimitationStatus> = new BehaviorSubject(null);

    constructor(
        private dataService: DataService,
        private configService: ConfigService,
        private eventService: EventService,
        private modalService: ModalService,
        private injectionService: InjectionService,
    ) {
        if (this.configService.get('$base.profile.limitations.use')) {
            this.useRealityCheck = !!_find(
                this.configService.get('$base.profile.limitations.limitTypes'),
                ['value', 'realityChecker'],
            );
        }
        this.registerMethod();
    }

    /**
     * Get realityCheck status
     *
     * @return {boolean} True if reality check enabled
     */
    public get realityCheckEnabled(): boolean {
        return this.useRealityCheck;
    }

    public get userLimitationStatus(): TUserLimitationStatus {
        return this.userStatus$.getValue();
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
        if (this.realityCheckEnabled) {
            userProfile$.pipe(filter((v) => !!v)).subscribe((userProfile) => {
                const defaultPeriod: number = this.configService.get('$base.profile.limitations.realityChecker.period');
                this.checkPeriod = (parseInt(userProfile.extProfile.realityCheckTime) || defaultPeriod) * 60 * 1000;
            });

            this.loginTime = this.configService.get<number>({
                name: 'realityCheckerTime',
                storageType: 'sessionStorage',
            });

            if (!this.loginTime || force) {
                this.loginTime = new Date().getTime();
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
    public async getRealityCheck(from: number): Promise<IActivityResultData> {
        try {
            const result: IData<IActivityResultData> = await this.dataService.request<IData>(
                'limit/realityCheck',
                {from: dayjs(from).add(-1 * dayjs().utcOffset(), 'minute').format('YYYY-MM-DD HH:mm:ss')});
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
            this.userStatus$.next(result.data.UserStatus);
            return result.data;
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Error'),
                    message: _isString(error.errors[0])
                        ? error.errors[0] : gettext('An error has occurred when getting user self-exclusion'),
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
            this.showModalUpdateLimit(result, exclusion);
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Profile update failed'),
                    message: error.errors,
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
    public async removeUserSelfExclusion(limit?: TLimitationType): Promise<void> {
        try {
            const result: IData<ISelfExclusionSingleData> =
                await this.dataService.request('limit/removeExclusion', {limit});
            this.showModalUpdateLimit(result);
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Error'),
                    message: error.errors?.[0] || gettext('An error has occurred when removing user self-exclusion'),
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
        const date = dayjs().add(days, 'day');
        await this.dataService.request({
            name: 'userSelfDisable',
            system: 'limit',
            // eslint-disable-next-line max-len
            url: `/profiles/disable?dateTo=${date.add(-1 * date.utcOffset(), 'minute').format('YYYY-MM-DD HH:mm:ss.SSS')}`,
            type: 'PUT',
        });
        this.eventService.emit({name: 'USER_STATUS_DISABLE'});
    }

    public async setSelfExclusion(period: string): Promise<IData<string | IResultSelfExclusion>> {
        try {
            const result: IData<string | IResultSelfExclusion> =
                await this.dataService.request('limit/selfExclusion', {period});

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Profile updated successfully'),
                    message: _isString(result.data)
                        ? result.data : gettext('Your profile has been successfully updated'),
                    wlcElement: 'notification_profile-update-success',
                },
            });

            if (_isObject(result.data) && result.data.result?.loggedIn === '0') {
                this.userService ??= await this.injectionService.getService<UserService>('user.user-service');
                this.userService.logout();
                return result;
            }

            this.eventService.emit({name: 'remove_exclusion'});
            return result;
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Profile update failed'),
                    message: error.errors,
                    wlcElement: 'notification_self-exclusion-set-error',
                },
            });
        }
    }

    public async requestAccountClosure(): Promise<void> {
        try {
            await this.dataService.request('limit/accountClosure');
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Profile update failed'),
                    message: error.errors,
                    wlcElement: 'notification_account-closure-error',
                },
            });
        }
    }

    /**
     * Process reality check
     *
     * @return {Promise}
     */
    protected async processRealityCheck(): Promise<void> {
        const now: number = new Date().getTime();
        if (now > (this.lastCheck + this.checkPeriod)) {
            const result: IActivityResultData = await this.getRealityCheck(this.loginTime);
            this.intervalChecker = null;
            this.userService ??= await this.injectionService.getService<UserService>('user.user-service');
            this.modalService.showModal({
                id: 'reality-check-info',
                modalTitle: gettext('Activity checker'),
                withoutPadding: true,
                componentName: 'user.wlc-reality-check-info',
                componentParams: {
                    fromTime: result.fromTime,
                    tableConfig: {
                        rows: this.createWalletsResults(<IIndexing<IActivityResult>>result.wallets),
                    },
                    theme:
                        this.configService.get<IMGAConfig>('$modules.user.components["wlc-reality-check-info"].theme')??
                        'default',
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
                        this.loginTime = new Date().getTime();
                        this.intervalChecker = timer(60000, 60000).subscribe(() => {
                            this.processRealityCheck();
                        });
                    }
                    this.lastCheck = new Date().getTime();
                    this.configService.set<number>({
                        name: 'realityLastCheckTime',
                        storageType: 'sessionStorage',
                        value: this.lastCheck,
                    });
                },
            });
        }
    }

    private createWalletsResults(items?: IIndexing<IActivityResult>): ActivityResultModel[] {
        const wallets: ActivityResultModel[] = [];

        if (Array.isArray(items)) {
            wallets.push(new ActivityResultModel(
                {service: 'LimitationService', method: 'processRealityCheck'},
                null,
                this.userService.userProfile.selectedCurrency),
            );
        } else {
            for (const currency in items) {
                wallets.push(new ActivityResultModel(
                    {service: 'LimitationService', method: 'processRealityCheck'},
                    items[currency],
                    currency,
                ));
            }
        }

        return wallets;
    }

    private showModalUpdateLimit(result: IData<ISelfExclusionSingleData>, exclusion?: ILimitationExclusion): void {
        if (result.data?.type === 'queue') {
            let time: string = '';
            const dateTimeFromSQL: Dayjs = dayjs(result.data.date, 'YYYY-MM-DD HH:mm:ss');

            if (dateTimeFromSQL.isValid()) {
                time = dateTimeFromSQL.add(dayjs().utcOffset(), 'minute').format('MM.DD.YYYY HH:mm');
            } else {
                time = dayjs().add(1, 'day').format('MM.DD.YYYY');
            }

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('User Limits'),
                    message: (exclusion?.value
                        ? gettext('The limit was successfully added and will be applied on {{time}}')
                        : gettext('The limit will be removed on {{time}}')),
                    messageContext: {
                        time,
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
                    message: gettext('Your profile has been successfully updated'),
                    wlcElement: 'notification_profile-update-success',
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
            params: {
                single: 1,
            },
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

        this.dataService.registerMethod({
            name: 'selfExclusion',
            url: '/profiles/self-exclusion',
            system: 'limit',
            type: 'PUT',
        });

        this.dataService.registerMethod({
            name: 'accountClosure',
            url: '/userSelfExclusion/accountClosure',
            system: 'limit',
            type: 'POST',
        });
    }

    private mapFunc(data: unknown): unknown {
        if (_isArray(data) && data.length === 1) {
            return data[0];
        }
        return data;
    }
}
