import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {
    AbstractComponent,
    ConfigService,
    EventService,
    ModalService,
    ValidatorType,
    ICheckboxCParams,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {IPushMessageParams, NotificationEvents} from 'wlc-engine/modules/core/system/services/notification';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {
    AddProfileInfoComponent,
    IAddProfileInfoCParams,
} from 'wlc-engine/modules/user/components/add-profile-info/';

import * as Params from './profile-form.params';

import {
    find as _find,
} from 'lodash-es';

/**
 * Profile form component.
 *
 * @example
 *
 * {
 *     name: 'user.wlc-profile-form',
 * }
 *
 */
@Component({
    selector: '[wlc-profile-form]',
    templateUrl: './profile-form.component.html',
    styleUrls: ['./styles/profile-form.component.scss'],
})
export class ProfileFormComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IProfileFormCParams;
    public $params: Params.IProfileFormCParams;
    public userProfile = this.user.userProfile$;
    public sendEmail: boolean;
    public userToggleChoice: boolean;
    public toggleBtn: ICheckboxCParams = {
        name: 'notification',
        type: 'toggle',
        control: new FormControl(),
        onChange: (checked: boolean) => {
            this.notificationToggle(checked);
        },
    };

    constructor(
        @Inject('injectParams') protected params: Params.IProfileFormCParams,
        protected user: UserService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected configService: ConfigService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        await this.configService.ready;
        this.toggleBtn.control.valueChanges.subscribe((value) => {
            this.userToggleChoice = this.toggleBtn.control.value;
        });

        this.userProfile.subscribe((profile) => {

            if (profile) {
                if (!this.toggleBtn.control.untouched) {
                    this.toggleBtn.control.setValue(this.userToggleChoice);
                } else {
                    this.toggleBtn.control.setValue(profile.extProfile?.sendEmail);
                }
                this.cdr.detectChanges();
            }
        });
    }

    public async ngSubmit(form: FormGroup): Promise<boolean> {
        const result = await this.user.updateProfile(form.value, false);

        if (result === true) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Profile updated successfully'),
                    message: gettext('Your profile has been updated successfully'),
                    wlcElement: 'notification_profile-update-success',
                },
            });
            this.userProfile.next(this.user.userProfile);
            this.cdr.detectChanges();
            return true;
        } else {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Profile update failed'),
                    message: result.errors,
                    wlcElement: 'notification_profile-update-error',
                },
            });

            if (result.errors.currentPassword) {
                const currentPassword: IFormComponent = _find(this.$params.config.components, component => {
                    return component.params.name === 'currentPassword';
                });
                currentPassword.params.control.setErrors({currentPassword: true});
            }
            return false;
        }
    }

    public changePasswordModal(): void {
        this.modalService.showModal('changePassword');
    }

    public addBankingInformation(): void {
        this.modalService.showModal({
            id: 'add-profile-info',
            modifier: 'add-profile-info',
            component: AddProfileInfoComponent,
            componentParams: <IAddProfileInfoCParams>{
                title: gettext('Banking information'),
                formConfig: {
                    class: 'wlc-form-wrapper',
                    components: [
                        this.changeValidators(FormElements.bankNameText, []),
                        this.changeValidators(FormElements.branchCode, []),
                        this.changeValidators(FormElements.swift, []),
                        this.changeValidators(FormElements.ibanNumber, []),
                        FormElements.password,
                        FormElements.submit,
                    ],
                },
                formData: this.userProfile,
            },
            showFooter: false,
            dismissAll: true,
            backdrop: 'static',
        });

    }

    public async notificationToggle(checked: boolean): Promise<void> {

        try {
            const userProfile = {
                extProfile: {
                    dontSendEmail: !checked,
                    sendEmail: checked,
                },
            };

            await this.user.updateProfile(userProfile, true);
        } catch (e) {
            //
        }
    }

    private changeValidators(
        componentParams: Params.IFieldComponentParams,
        newValidators: ValidatorType[],
    ): Params.IFieldComponentParams {
        componentParams.params.validators = newValidators;
        return componentParams;
    }
}
