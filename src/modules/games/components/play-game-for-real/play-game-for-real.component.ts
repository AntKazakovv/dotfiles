import {
    Component,
    Inject,
    OnInit,
    Input,
    HostBinding,
    ChangeDetectionStrategy,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StateService} from '@uirouter/core';

import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services';
import {IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    AppType,
    SignInFormAbstract,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';
import {
    GAME_LAUNCH_STORAGE_KEY,
    GAME_LAUNCH_STORAGE_TYPE,
} from 'wlc-engine/modules/games/system/constants/game-launch.constants';

import * as Params from './play-game-for-real.params';

/**
 * Play game for real form component.
 *
 * @example
 *
 * {
 *     name: 'games.wlc-play-game-for-real',
 * }
 *
 */
@Component({
    selector: '[wlc-play-game-for-real]',
    templateUrl: './play-game-for-real.component.html',
    styleUrls: ['./styles/play-game-for-real.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayGameForRealComponent extends SignInFormAbstract<Params.IPlayGameForRealCParams> implements OnInit {
    @Input() public inlineParams: Params.IPlayGameForRealCParams;
    @HostBinding('class.is-auth') protected isAuth: boolean;

    public useTurnstile: boolean = this.configService.get<boolean>('appConfig.objectData.turnstile.isEnabled');

    constructor(
        @Inject('injectParams') protected params: Params.IPlayGameForRealCParams,
        injectionService: InjectionService,
        modalService: ModalService,
        protected logService: LogService,
        eventService: EventService,
        translateService: TranslateService,
        stateService: StateService,
        userService: UserService,
    ) {
        super(
            <IMixedParams<Params.IPlayGameForRealCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            },
            injectionService,
            userService,
            modalService,
            eventService,
            stateService,
            translateService,
        );

        this.config = Params.playGameForRealConfig({
            game: this.params.common?.game,
            disableDemo: this.params.common?.disableDemo,
            lang: translateService.currentLang || 'en',
            authenticated: this.configService.get<boolean>('$user.isAuthenticated'),
            useLogin: this.configService.get<boolean>('$base.site.useLogin'),
            isKiosk: this.configService.get<AppType>('$base.app.type') === 'kiosk',
            showPplInfo: this.params.common?.showPplInfo,
            isLatestBetsWidget: this.params.common?.isLatestBetsWidget,
            latestBetsWidgetParams: {
                currency: this.params.common?.latestBetsWidgetParams?.currency,
                amount: this.params.common?.latestBetsWidgetParams?.amount,
                coefficient: this.params.common?.latestBetsWidgetParams?.coefficient,
                profit: this.params.common?.latestBetsWidgetParams?.profit,
                isWin: this.params.common?.latestBetsWidgetParams?.isWin,
            },
            enableSocialMediaIcons: this.isSocialMediaIconsEnabled,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.onLoginSuccess();
        this.onPlayDemo();
        this.onPlayReal();
        this.onSignUp();
        this.scheduleGameLaunch();
    }

    protected get isSocialMediaIconsEnabled(): boolean {
        return this.configService.get('$base.profile.socials.use')
            || this.configService.get('appConfig.siteconfig.useMetamask');
    }

    /**
     * Handler for click on "play demo"
     */
    protected onPlayDemo(): void {
        this.eventService.subscribe({
            name: Params.Events.PLAY_DEMO,
        }, () => {
            this.modalService.hideModal('play-game-for-real', undefined, 'submit');
            if (this.$params.common?.game) {
                this.$params.common.game.launch({
                    demo: true,
                });
            }
        }, this.$destroy);
    }

    /**
     * Handler for click on "play real"
     */
    protected onPlayReal(): void {
        this.eventService.subscribe({
            name: Params.Events.PLAY_REAL,
        }, () => {
            this.modalService.hideModal('play-game-for-real', undefined, 'submit');
            if (this.$params.common?.game) {
                this.$params.common.game.launch({
                    demo: false,
                });
            }
        }, this.$destroy);
    }

    protected onLoginSuccess(): void {
        this.eventService.subscribe({
            name: 'USER_PROFILE',
        }, () => {
            if (this.$params.common?.game) {
                this.modalService.hideModal('play-game-for-real', undefined, 'submit');
                this.$params.common.game.launch({
                    demo: false,
                });
            }
        }, this.$destroy);
    }

    protected onSignUp(): void {
        this.eventService.subscribe({
            name: Params.Events.SIGN_UP,
        }, () => {
            if (!this.configService.get<boolean>('$base.site.restrictRegistration')) {
                this.modalService.hideModal('play-game-for-real', undefined, 'will signup');
            }
            setTimeout(() => {
                this.modalService.showModal('signup');
            }, 1000);
        }, this.$destroy);
    }

    protected scheduleGameLaunch(): void {
        const game = this.$params.common?.game;

        if (!this.isAuth && game) {
            this.configService.set({
                value: {merchantID: game.merchantID, launchCode: game.launchCode},
                name: GAME_LAUNCH_STORAGE_KEY,
                storageType: GAME_LAUNCH_STORAGE_TYPE,
            });
        }
    }
}
