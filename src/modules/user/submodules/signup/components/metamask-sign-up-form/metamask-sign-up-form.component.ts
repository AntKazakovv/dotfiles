import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

import _merge from 'lodash-es/merge';
import _isObject from 'lodash-es/isObject';

import {
    ConfigService,
    EventService,
    IFormWrapperCParams,
    IIndexing,
    LogService,
    UserActionsAbstract,
    InjectionService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';
import {CuracaoRequirement} from 'wlc-engine/modules/app/system';
import {SignUpService} from 'wlc-engine/modules/user/submodules/signup/system/services/signup.service';

import * as Params from './metamask-sign-up-form.params';

@Component({
    selector: '[wlc-metamask-sign-up-form]',
    templateUrl: './metamask-sign-up-form.component.html',
    styleUrls: ['./styles/metamask-sign-up-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MetamaskSignUpFormComponent
    extends UserActionsAbstract<Params.IMetamaskSignUpFormCParams>
    implements OnInit {

    public config: IFormWrapperCParams;
    public override $params: Params.IMetamaskSignUpFormCParams;
    public errors$: BehaviorSubject<IIndexing<string>> = new BehaviorSubject(null);

    constructor(
        @Inject(CuracaoRequirement) private enableRequirement: boolean,
        @Inject('injectParams') protected injectParams: Params.IMetamaskSignUpFormCParams,
        userService: UserService,
        protected signupService: SignUpService,
        logService: LogService,
        configService: ConfigService,
        eventService: EventService,
        injectionService: InjectionService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, eventService, injectionService, logService, userService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.config = this.$params.formConfig || Params.metamaskSignUpFormConfig;
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

    /**
     * Handle form-wrapper submit event
     * @param {FormGroup} form `FormGroup`
     * @returns {Promise<void>}
     */
    public async ngSubmit(form: UntypedFormGroup): Promise<boolean> {
        try {
            form.disable();

            let regData = form.getRawValue();
            regData = _merge(this.$params.regData, regData);

            await this.userService.validateRegistration(this.signupService.prepareRegData(regData));
            this.userService.setProfileData(regData);
            await this.userService.createUserProfile(this.userService.userProfile.data);
            this.userService.finishRegistration();

            this.eventService.emit({
                name: this.$params.submitEventName,
                data: true,
            });
        }
        catch (error) {
            this.showRegError(error);
            if (_isObject(error.errors)) {
                this.errors$.next(error.errors);
            }
            return;
        }
        finally {
            form.enable();
        }
    }
}
