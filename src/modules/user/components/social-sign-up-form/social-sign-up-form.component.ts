import {UntypedFormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
} from '@angular/core';

import {
    ConfigService,
    EventService,
    LogService,
    IFormWrapperCParams,
    UserActionsAbstract,
    InjectionService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {SocialService} from 'wlc-engine/modules/user/system/services/social/social.service';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {CuracaoRequirement} from 'wlc-engine/modules/app/system';
import {UserHelper} from 'wlc-engine/modules/user/system/helpers/user.helper';

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

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISocialSignUpFormCParams,
        configService: ConfigService,
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
        }, configService, eventService,  injectionService, logService, userService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.config = this.$params.formConfig || Params.socialSignUpFormConfig;
        const data = {
            shift: 0,
            config: this.config,
            selfExcludedText: this.configService.get<string>('$base.legal.selfExcludedCheckboxText'),
            enableRequirement: this.enableRequirement,
        };

        UserHelper.modifyFormByLicense(data);
        if (this.$params.formData) {
            this.formData = new BehaviorSubject(this.$params.formData);
        }
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
