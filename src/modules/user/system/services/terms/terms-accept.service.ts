import {Injectable} from '@angular/core';
import {RawParams} from '@uirouter/core';

import {
    BehaviorSubject,
    filter,
    first,
    firstValueFrom,
} from 'rxjs';

import {
    CachingService,
    ConfigService,
    DataService,
    EventService,
    HooksService,
    IData,
    IIndexing,
    IPushMessageParams,
    IUserInfo,
    ModalService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import {IHookRequestData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {IHookGameStartData} from 'wlc-engine/modules/core/system/config/resolvers';

@Injectable({
    providedIn: 'root',
})
export class TermsAcceptService {

    private acceptModalId = 'accept-terms';
    private statesMap = new Map<string, IIndexing<unknown>>();

    constructor(
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected dataService: DataService,
        protected eventService: EventService,
        protected cachingService: CachingService,
        protected hooksService: HooksService,
    ) {
        if (this.configService.get<string>('appConfig.siteconfig.termsOfService')) {
            this.init();
        }
    }

    /**
     * Send accept terms and conditions to backend
     *
     * @returns {Promise<void>}
     */
    public async accept(): Promise<void> {
        const res = await this.dataService.request<IData<IUserInfo['toSVersion']>>({
            name: 'acceptTermsOfService',
            system: 'user',
            url: '/acceptTermsOfService',
            type: 'POST',
            params: {},
        });

        this.cachingService.clear('accept-terms-timeout');

        this.eventService.emit(({
            name: 'UPDATE_ACCEPTED_TERMS',
            data: res.data,
        }));
    }

    /**
     * Check state to access without accepting terms and conditions
     *
     * @param {string} state - state name
     * @param {RawParams} [params] - state params
     * @returns {boolean} - true when access allowed
     */
    public checkState(state: string, params?: RawParams): boolean {
        const checkStateParams = (params: IIndexing<unknown>, current: RawParams): boolean => {
            const keys = Object.keys(params);
            for (let i = 0; i < keys.length; i++) {
                if (params[keys[i]] != current[keys[i]]) {
                    return false;
                }
            }

            return true;
        };

        return this.statesMap.has(state)
            && checkStateParams(this.statesMap.get(state), params);
    }

    /**
     * Set timeout showing modal for 5 minutes
     *
     * @returns {Promise<void>}
     */
    public setModalTimeout(): Promise<void> {
        return this.cachingService.set<number>('accept-terms-timeout', 1, true, 5 * 60 * 1000);
    }

    /**
     * Shows a notification to the user that they must accept
     * the terms and conditions to access the page
     */
    public showDeniedNotify(): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title: gettext('Error'),
                message: gettext('You must accept terms and conditions to access this page.'),
                wlcElement: 'notification_no-accept',
            },
        });
    }

    protected async shouldModalBeShown(userInfo: UserInfo): Promise<boolean> {
        return !userInfo.isTermsActual
            && !userInfo.blockByLocation
            && !this.modalService.getActiveModal(this.acceptModalId)
            && !await this.checkModalTimeout();
    }

    private init(): void {
        this.hooksService.set<IHookRequestData>('dataService:requestMethod', this.onRequestMethod, this);
        this.hooksService.set<IHookGameStartData>('beforeStartGame', this.beforeStartGame, this);

        const states = this.configService.get<string[]>({name: '$base.termsAvailableStates'}) || [];
        for (let i = 0; i < states.length; i++) {
            const [state, paramsString] = states[i].split('?');
            const params: IIndexing<unknown> = {};
            if (paramsString) {
                paramsString.split('&').forEach((item) => {
                    const [key, value] = item.split('=');
                    params[key] = value;
                });
            }
            this.statesMap.set(state, params);
        }

        this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
            .pipe(filter((v) => !!v))
            .subscribe(async (userInfo) => {
                if (await this.shouldModalBeShown(userInfo)) {
                    this.modalService.showModal(this.acceptModalId);
                }
            });
    }

    private async beforeStartGame(data: IHookGameStartData): Promise<IHookGameStartData> {
        if (!data.demo && this.configService.get<boolean>('$user.isAuthenticated')) {
            const reason = await this.openModalAndCheckReason();
            if (reason !== 'accept') {
                data.result.reject(gettext('You must accept the terms and conditions to complete this action.'));
                this.showDeniedNotify();
            }
        }
        return data;
    }

    private async onRequestMethod({request, params}: IHookRequestData): Promise<IHookRequestData> {
        if (!this.configService.get<boolean>('$user.isAuthenticated')) {
            return {request, params};
        }

        if (
            (request.type === 'POST'
                && (request.url.match(/^\/bonuses\/\d*$/) || request.url.match(/^\/tournaments\/\d*$/)))
            || (request.type === 'PUT' && request.url.match(/^\/store/))
        ) {
            const reason = await this.openModalAndCheckReason();
            if (reason !== 'accept') {
                throw {
                    system: 'data',
                    name: request.name,
                    status: 'error',
                    errors: [
                        gettext('You must accept the terms and conditions to complete this action.'),
                    ],
                };
            }
        }
        return {request, params};
    }

    private async openModalAndCheckReason(): Promise<string> {
        const userInfo$ = this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'});
        const userInfo = userInfo$.value ?? await firstValueFrom(userInfo$.pipe(first((v) => !!v)));
        if (!userInfo.isTermsActual) {
            const modal = await this.modalService.showModal(this.acceptModalId, {source: 'router'});
            await modal.closed;
            return modal.closeReason;
        }
        return 'accept';
    }

    private async checkModalTimeout(): Promise<boolean> {
        return !!await this.cachingService.get<number>('accept-terms-timeout');
    }
}
