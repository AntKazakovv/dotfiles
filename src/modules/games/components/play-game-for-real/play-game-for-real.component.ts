import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
    HostBinding,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {StateService} from '@uirouter/core';

import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IFormWrapperCParams} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';

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
})
export class PlayGameForRealComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.IPlayGameForRealCParams;
    @HostBinding('class.is-auth') protected isAuth: boolean;
    public $params: Params.IPlayGameForRealCParams;
    public config: IFormWrapperCParams;

    constructor(
        @Inject('injectParams') protected params: Params.IPlayGameForRealCParams,
        protected userService: UserService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected logService: LogService,
        protected eventService: EventService,
        protected translateService: TranslateService,
        protected stateService: StateService,
        protected configService: ConfigService,
    ) {
        super(<IMixedParams<Params.IPlayGameForRealCParams>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        });
        this.config = Params.playGameForRealConfig({
            game: this.params.common?.game,
            disableDemo: this.params.common?.disableDemo,
            lang: translateService.currentLang || 'en',
            authenticated: userService.isAuthenticated,
        });
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.onLoginSuccess();
        this.onPlayDemo();
        this.onPlayReal();
        this.onSignUp();
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
    }

    public ngSubmit(form: FormGroup): void {
        const {email, login, password} = form.value;
        const loginParam = email ? email : login;

        this.userService.loginRequest(loginParam, password);
    }

    /**
     * Handler for click on "play demo"
     */
    protected onPlayDemo(): void {
        this.eventService.subscribe({
            name: Params.Events.PLAY_DEMO,
        }, () => {
            this.modalService.hideModal('play-game-for-real');
            if (this.stateService.params.demo === 'true') {
                return;
            }
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
            this.modalService.hideModal('play-game-for-real');
            if (this.stateService.params.demo === 'false') {
                return;
            }
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
                this.modalService.hideModal('play-game-for-real');
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
                this.modalService.hideModal('play-game-for-real');
            }
            setTimeout(() => {
                this.modalService.showModal('signup');
            }, 1000);
        }, this.$destroy);
    }
}

