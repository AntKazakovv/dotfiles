import {UntypedFormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    inject,
} from '@angular/core';

import {
    EventService,
    LogService,
    IFormWrapperCParams,
    UserActionsAbstract,
    InjectionService,
    RouterService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {SocialService} from 'wlc-engine/modules/user/system/services/social/social.service';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {CuracaoRequirement} from 'wlc-engine/modules/app/system';
import {SignUpService} from 'wlc-engine/modules/user/submodules/signup/system/services/signup.service';

import * as Params from './social-sign-up-form.params';

@Component({
    selector: '[wlc-social-sign-up-form]',
    templateUrl: './social-sign-up-form.component.html',
    styleUrls: ['./styles/social-sign-up-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SocialSignUpFormComponent extends UserActionsAbstract<Params.ISocialSignUpFormCParams> implements OnInit {
    public config: IFormWrapperCParams;
    public override $params: Params.ISocialSignUpFormCParams;

    protected routerService = inject(RouterService);

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISocialSignUpFormCParams,
        logService: LogService,
        userService: UserService,
        eventService: EventService,
        protected socialService: SocialService,
        injectionService: InjectionService,
        @Inject(WINDOW) protected window: Window,
        @Inject(CuracaoRequirement) private enableRequirement: boolean,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, eventService,  injectionService, logService, userService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        const routerHistory: string[] = this.routerService.history;
        this.config = this.$params.formConfig || Params.socialSignUpFormConfig;
        
        if (this.$params.formData['email'] 
            && routerHistory[routerHistory.length-2].includes('user-social-register')
        ) {
            this.lockField(this.config, 'email');
        }

        const data = {
            shift: 0,
            config: this.config,
            selfExcludedText: this.configService.get<string>('$base.legal.selfExcludedCheckboxText'),
            enableRequirement: this.enableRequirement,
        };

        SignUpService.modifyFormByLicense(data);
        if (this.$params.formData) {
            this.formData = new BehaviorSubject(this.$params.formData);
        }
    }

    protected lockField(
        config: IFormWrapperCParams, 
        fieldName: string, 
    ): IFormWrapperCParams {
        const resultConfig: IFormWrapperCParams = config;

        resultConfig.components.forEach(component => {
            if (component.params.name === fieldName) {
                component.params.locked = true;
            }
        });

        return resultConfig;
    }
    
    public async ngSubmit(form: UntypedFormGroup): Promise<boolean> {
        try {
            form.disable();

            if (!await this.checkConfirmation(form)) {
                return false;
            }

            const regData = this.formDataPreparation(form);

            await this.socialService.socialRegisterComplete(regData.data);
            return true;
        } catch (error) {
            this.showRegError(
                error,
                '1.5.3',
                gettext('Social registration failed'),
            );
            return false;
        } finally {
            form.enable();
        }
    }
}
