import {FormGroup} from '@angular/forms';
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
    IIndexing,
    IFormWrapperCParams,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {UserActionsAbstract} from 'wlc-engine/modules/user/system/classes/user-actions-abstract.class';
import {SocialService} from 'wlc-engine/modules/user/system/services/social/social.service';

import * as Params from './social-sign-up-form.params';

@Component({
    selector: '[wlc-social-sign-up-form]',
    templateUrl: './social-sign-up-form.component.html',
    styleUrls: ['./styles/social-sign-up-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SocialSignUpFormComponent extends UserActionsAbstract<Params.ISocialSignUpFormCParams> implements OnInit {
    public config: IFormWrapperCParams;
    public $params: Params.ISocialSignUpFormCParams;
    public formData: BehaviorSubject<IIndexing<unknown>>;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISocialSignUpFormCParams,
        protected configService: ConfigService,
        protected logService: LogService,
        protected userService: UserService,
        protected eventService: EventService,
        protected socialService: SocialService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, userService, eventService, logService);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.config = this.$params.formConfig || Params.socialSignUpFormConfig;

        if (this.$params.formData) {
            this.formData = new BehaviorSubject(this.$params.formData);
        }
    }

    public async ngSubmit(form: FormGroup): Promise<void> {
        try {
            form.disable();

            if (!this.checkConfirmation(form)) {
                return;
            }

            const regData = this.formDataPreparation(form);

            await this.socialService.socialRegisterComplete(regData.data);
            // TODO: After registration error is caught, though the user has been registered successfully.
            // {code: 400, errors: null, status: "error"}
            window.location.reload();
        } catch (error) {
            this.showRegError(
                error,
                '1.5.3',
                gettext('Social registration failed'),
            );
        } finally {
            form.enable();
        }
    }

}
