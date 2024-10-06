import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {StateService} from '@uirouter/core';
import {TranslateService} from '@ngx-translate/core';

import _some from 'lodash-es/some';

import {
    EventService,
    InjectionService,
    LogService,
    ModalService,
} from 'wlc-engine/modules/core/system/services';
import {
    SignInFormAbstract,
    IMixedParams,
    AppType,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {TurnstileService} from 'wlc-engine/modules/security/turnstile';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

import * as Params from './sign-in-form.params';
import * as Interfaces from './sign-in-form.interfaces';

/**
 * Sign-in form component.
 * Can be called via url path (/en/login) as a modal window or via modal service (showModal('login')).
 *
 * @example
 *
 * {
 *     name: 'user.wlc-sign-in-form',
 * }
 *
 */
@Component({
    selector: '[wlc-sign-in-form]',
    templateUrl: './sign-in-form.component.html',
    styleUrls: ['./styles/sign-in-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInFormComponent extends SignInFormAbstract<Interfaces.ISignInFormCParams> implements OnInit {
    constructor(
        @Inject('injectParams') protected injectParams: Interfaces.ISignInFormCParams,
        injectionService: InjectionService,
        eventService: EventService,
        protected logService: LogService,
        modalService: ModalService,
        userService: UserService,
        stateService: StateService,
        translateService: TranslateService,
    ) {
        super(
            <IMixedParams<Interfaces.ISignInFormCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
            injectionService,
            userService,
            modalService,
            eventService,
            stateService,
            translateService,
        );
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.config = this.$params.formConfig || Params.generateConfig(
            this.configService.get<boolean>('$base.site.useLogin'),
            this.configService.get<AppType>('$base.app.type') === 'kiosk',
        );

        if (this.configService.get<boolean>('$base.profile.socials.use')
            || this.configService.get<boolean>('appConfig.siteconfig.useMetamask')) {
            this.addModifiers('socials');

            if (!_some(this.config.components, (el: IFormComponent) => el.name === 'user.wlc-social-networks')) {
                this.config.components.unshift({
                    name: 'user.wlc-social-networks',
                    params: {},
                });
            }
        }

        const useTurnstile = this.configService.get('appConfig.objectData.turnstile.isEnabled');
        if (useTurnstile){
            const turnstileService = await this.injectionService.getService<TurnstileService>(
                'turnstile.turnstile-service',
            );
            turnstileService.launch('login');
        }
    }
}
