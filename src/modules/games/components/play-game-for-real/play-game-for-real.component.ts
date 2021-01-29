import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {StateService} from '@uirouter/core';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    EventService,
    LogService,
    ModalService,
} from 'wlc-engine/modules/core/system/services';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {IFormWrapperCParams} from 'wlc-engine/modules/core';
import * as Params from './play-game-for-real.params';

import {
    union as _union,
} from 'lodash-es';

/**
 * Play game for real form component.
 *
 * @example
 *
 * {
 *     name: 'games.wlc-play-for-real',
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
    }

    public async ngSubmit(form: FormGroup): Promise<void> {
        const {email, login, password} = form.value;
        const loginParam = email ? email : login;
        try {
            await this.userService.login(loginParam, password);
        } catch (error) {
            this.logService.sendLog({code: '1.2.0', data: error});
        }
    }

    /**
     * Handler for click on "play demo"
     */
    protected onPlayDemo(): void {
        this.eventService.subscribe({
            name: Params.Events.PLAY_DEMO,
        }, () => {
            this.modalService.closeModal('play-game-for-real');
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

    protected onLoginSuccess(): void {
        this.eventService.subscribe({
            name: 'LOGIN',
        }, () => {
            if (this.$params.common?.game) {
                this.modalService.closeModal('play-game-for-real');
                this.$params.common.game.launch({
                    demo: false,
                });
            }
        }, this.$destroy);
    }
}

