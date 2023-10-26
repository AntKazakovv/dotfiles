import {Injectable} from '@angular/core';

import {
    RawParams,
    Transition,
    UIRouter,
} from '@uirouter/core';

import {
    BehaviorSubject,
    Subscription,
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
    IEvent,
    IHookHandlerDescriptor,
    IIndexing,
    IModalParams,
    IPushMessageParams,
    IUserInfo,
    InjectionService,
    ModalService,
    NotificationEvents,
    WlcModalComponent,
} from 'wlc-engine/modules/core';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import {IHookRequestData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {IHookGameStartData} from 'wlc-engine/modules/core/system/config/resolvers';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';

export type IValidateData = Pick<IUserInfo, 'ageConfirmed' | 'agreeWithSelfExcluded' | 'agreedWithTermsAndConditions'>;

@Injectable({
    providedIn: 'root',
})
export class TermsAcceptService {

    private acceptModalId = 'accept-terms';
    private statesMap = new Map<string, IIndexing<unknown>>();
    private userInfoSubscribe: Subscription;
    private hookOnRequestMethod: IHookHandlerDescriptor;
    private hookBeforeStartGame: IHookHandlerDescriptor;
    private transitionOnBeforeDestroy: Function;
    private userService: UserService;

    private readonly acceptDefaultModalConfig: IModalParams = {
        id: this.acceptModalId,
        componentName: 'user.wlc-accept-terms',
        componentParams: {},
        modalTitle: gettext('Acceptance of new Terms & Conditions'),
        showFooter: false,
        dismissAll: true,
    };
    private readonly acceptExtendedModalConfig: IModalParams = {
        id: this.acceptModalId,
        componentName: 'user.wlc-accept-terms',
        modalTitle: gettext('User information update'),
        showFooter: false,
        dismissAll: true,
        componentParams: {
            theme: 'extended',
        },
    };

    constructor(
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected dataService: DataService,
        protected eventService: EventService,
        protected cachingService: CachingService,
        protected hooksService: HooksService,
        protected injectionService: InjectionService,
        protected router: UIRouter,
    ) {
        this.init();
    }

    /**
     * Send accept terms and conditions to backend
     *
     * @returns {Promise<void>}
     */
    public async accept(data: IValidateData): Promise<void> {
        if (await this.isRequireCheckbox()) {
            this.userService??= await this.injectionService.getService<UserService>('user.user-service');

            await this.userService.updateProfile(
                {
                    ageConfirmed: data.ageConfirmed,
                    agreeWithSelfExcluded: data.agreeWithSelfExcluded,
                    agreedWithTermsAndConditions: data.agreedWithTermsAndConditions,
                },
                {updatePartial: true},
            );
        } else {
            const res = await this.dataService.request<IData<IUserInfo['toSVersion']>>({
                name: 'acceptTermsOfService',
                system: 'user',
                url: '/acceptTermsOfService',
                type: 'POST',
                params: {},
            });
            this.eventService.emit(({
                name: 'UPDATE_ACCEPTED_TERMS',
                data: res.data,
            }));
        }
        this.cachingService.clear('accept-terms-timeout');
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

    /**
     * Open modal to the user that they must accept
     * the terms and conditions to complete this action
     */
    public async openModalAndCheckReason(): Promise<string> {
        const userInfo: UserInfo = await firstValueFrom(
            this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
                .pipe(first((userInfo: UserInfo): boolean => !!userInfo?.idUser)),
        );
        if (await this.shouldModalBeShown(userInfo)) {
            const modal = await this.showModal(userInfo);
            await modal.closed;
            return modal.closeReason;
        }
        return 'accept';
    }

    private async shouldModalBeShown(userInfo: UserInfo): Promise<boolean> {
        return (await this.isRequireCheckbox(userInfo) || !userInfo.isTermsActual)
            && !userInfo.blockByLocation
            && !this.modalService.getActiveModal(this.acceptModalId);
    }

    private async isRequireCheckbox(userInfo?: UserInfo): Promise<boolean> {
        if (!userInfo) {
            userInfo = await firstValueFrom(
                this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
                    .pipe(first((userInfo: UserInfo): boolean => !!userInfo?.idUser)),
            );
        }
        const requiredCheckbox: string[] = userInfo.getRequiredRegisterCheckbox(this.configService);
        if (requiredCheckbox.length) {
            return requiredCheckbox.some((key: string) => userInfo[key] === false);
        }
        return false;
    }

    private async init(): Promise<void> {
        let states = this.configService.get<string[]>({name: '$base.termsAvailableStates'}) || [];
        if (await this.isRequireCheckbox()) {
            states = states.filter((state: string) => {
                return state !== 'app.profile.cash.withdraw';
            });
        }

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
        if (await this.checkModalTimeout()) {
            this.cachingService.clear('accept-terms-timeout');
        }
        this.setHook();
        this.listenAuthEvents();
        this.listenUserInfo();
    }

    private setHook(): void {
        this.hookOnRequestMethod = this.hooksService
            .set<IHookRequestData>('dataService:requestMethod', this.onRequestMethod, this);
        this.hookBeforeStartGame = this.hooksService
            .set<IHookGameStartData>('beforeStartGame', this.beforeStartGame, this);
        this.transitionOnBeforeDestroy = this.onBeforeHook();
    }

    private onBeforeHook(): Function {
        return this.router.transitionService.onBefore({}, async (trans: Transition) => {
            if (this.configService.get<boolean>('$user.isAuthenticated')
                && !this.checkState(trans.to().name, trans.params())
            ) {
                const userInfo: UserInfo = await firstValueFrom(
                    this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
                        .pipe(first((userInfo: UserInfo): boolean => !!userInfo?.idUser)),
                );
                if (await this.shouldModalBeShown(userInfo)) {
                    this.showDeniedNotify();
                    const modal = await this.showModal(userInfo);
                    await modal.closed;
                    if (modal.closeReason !== 'accept') {
                        trans.abort();
                    } else {
                        this.router.stateService.reload();
                    }
                }
            }
        });
    }

    private listenAuthEvents(): void {
        this.eventService.filter([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
        ]).subscribe(async (event: IEvent<IData>) => {
            if (await this.checkModalTimeout()) {
                this.cachingService.clear('accept-terms-timeout');
            }
            switch (event.name) {
                case 'LOGIN':
                    this.listenUserInfo();
                    this.setHook();
                    break;
                case 'LOGOUT':
                    this.userInfoSubscribe.unsubscribe();
                    this.transitionOnBeforeDestroy();
                    this.hooksService.clear([this.hookBeforeStartGame, this.hookOnRequestMethod]);
                    break;
            }
        });
    }

    private listenUserInfo(): void {
        this.userInfoSubscribe = this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
            .pipe(filter((userInfo: UserInfo): boolean => !!userInfo?.idUser))
            .subscribe(async (userInfo: UserInfo) => {
                if (await this.shouldModalBeShown(userInfo) && !await this.checkModalTimeout()) {
                    this.showModal(userInfo);
                }
            });
    }

    private async beforeStartGame(data: IHookGameStartData): Promise<IHookGameStartData> {
        if (!data.demo) {
            const reason = await this.openModalAndCheckReason();
            if (reason !== 'accept') {
                data.result.reject(gettext('You must accept the terms and conditions to complete this action.'));
                this.showDeniedNotify();
            }
        }
        return data;
    }

    private async onRequestMethod({request, params}: IHookRequestData): Promise<IHookRequestData> {
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

    private async checkModalTimeout(): Promise<boolean> {
        return !!await this.cachingService.get<number>('accept-terms-timeout');
    }

    private async showModal(userInfo: UserInfo): Promise<WlcModalComponent> {
        if (await this.isRequireCheckbox(userInfo)) {
            return await this.modalService.showModal(
                this.acceptExtendedModalConfig,
                {requiredCheckbox: userInfo.getRequiredRegisterCheckbox(this.configService)},
            );
        } else {
            return await this.modalService.showModal(this.acceptDefaultModalConfig);
        }
    }
}
