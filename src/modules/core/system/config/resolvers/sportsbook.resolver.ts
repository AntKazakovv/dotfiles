import {
    ResolveTypes,
    StateService,
    Transition,
    UIRouter,
} from '@uirouter/core';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {
    LogService,
    TWaiter,
} from 'wlc-engine/modules/core/system/services/log/log.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {Deferred} from 'wlc-engine/modules/core/system/classes/deferred.class';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {SportsbookService} from 'wlc-engine/modules/sportsbook';
import {EventService} from 'wlc-engine/modules/core';
import {BaseGamesHandler} from './games-handler.base';

export const RejectedReason: Record<string, string> = {
    GamesCatalogNotReady: 'gamesCatalogNotReady',
    EmptyRequiredFields: 'emptyRequiredFields',
} as const;

export const sportsbookResolver: ResolveTypes = {
    token: 'sportsbook',
    deps: [
        ConfigService,
        LogService,
        StateService,
        UIRouter,
        ModalService,
        Transition,
        EventService,
        InjectionService,
    ],
    resolveFn: (
        configService: ConfigService,
        logService: LogService,
        stateService: StateService,
        router: UIRouter,
        modalService: ModalService,
        transition: Transition,
        eventService: EventService,
        injectionService: InjectionService,
    ) => {
        return new SportsbookHandler(
            configService,
            logService,
            stateService,
            router,
            modalService,
            transition,
            eventService,
            injectionService,
        ).result.promise;
    },
};

class SportsbookHandler extends BaseGamesHandler {
    public result = new Deferred();
    protected authenticated: boolean = false;
    protected sportsbookService: SportsbookService;

    constructor(
        configService: ConfigService,
        protected logService: LogService,
        protected stateService: StateService,
        protected router: UIRouter,
        modalService: ModalService,
        transition: Transition,
        protected eventService: EventService,
        injectionService: InjectionService,
    ) {
        super(
            configService,
            modalService,
            transition,
            injectionService,
        );
    }

    protected override async init(): Promise<void> {
        await super.init();

        this.modalProfileInfo.onModalHide = () => {
            if (!this.router.globals.current.name || this.router.globals.current.name === 'app.sportsbook') {
                // @ts-ignore no-implicit-any #672571
                const redirects = this.configService.get<boolean>('$base.redirects.states')['app.home']?.state;
                if (redirects === 'app.sportsbook') {
                    this.stateService.go('app.profile.main.info', this.transition.params());
                } else {
                    this.stateService.go('app.home', this.transition.params());
                }
            }
        };

        const waiter: TWaiter = this.logService.waiter({code: '3.0.11'}, 7000);

        await this.configService.ready;
        this.sportsbookService = await this.injectionService
            .getService<SportsbookService>('sportsbook.sportsbook-service');

        try {
            await this.sportsbookService.ready;
        } catch (err) {
            this.logService.sendLog({
                code: '3.0.0',
                data: err,
                flog: {
                    from: 'SportsbookHandler',
                },
            });
            this.result.reject(RejectedReason.GamesCatalogNotReady);
            return;
        } finally {
            waiter();
        }

        this.merchantId = this.sportsbookService.getSportsbookSettings().merchantId;
        this.authenticated = this.configService.get<boolean>('$user.isAuthenticated');

        if (this.authenticated) {
            this.checksForAuthenticated();
        } else {
            this.result.resolve();
        }
    }

    /**
     * Checks for authenticated users
     */
    private async checksForAuthenticated(): Promise<void> {
        try {
            await this.checkUserFields();
            this.result.resolve();
        } catch (err) {
            this.result.reject(err);
        }
    }
}
