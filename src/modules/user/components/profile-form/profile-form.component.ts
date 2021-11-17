import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
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
    IAddProfileInfoCParams,
} from 'wlc-engine/modules/user/components/add-profile-info/';

import * as Params from './profile-form.params';

import _find from 'lodash-es/find';
import _assign from 'lodash-es/assign';

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
    public userProfile = this.userService.userProfile$;
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
        protected userService: UserService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected configService: ConfigService,
    ) {
        super(
            {injectParams: params, defaultParams: Params.defaultParams},
            configService,
        );
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        await this.configService.ready;
        this.toggleBtn.control.valueChanges.pipe(takeUntil(this.$destroy)).subscribe(() => {
            this.userToggleChoice = this.toggleBtn.control.value;
        });

        await this.userService.fetchUserProfile();

        this.userProfile.pipe(takeUntil(this.$destroy)).subscribe((profile) => {

            if (profile) {
                if (!this.toggleBtn.control.untouched) {
                    this.toggleBtn.control.setValue(this.userToggleChoice);
                } else {
                    this.toggleBtn.control.setValue(profile.emailAgree);
                }
                this.cdr.detectChanges();
            }
        });
    }

    /**
     * Save profile form
     *
     * @param form {FormGroup}
     * @returns save status
     */
    public async ngSubmit(form: FormGroup): Promise<boolean> {
        const {pep} = form.value;
        delete form.value['pep'];
        if (pep) {
            form.value.extProfile = _assign({}, form.value.extProfile, {pep});
        }

        const result = await this.userService.updateProfile(form.value, false);

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

    /**
     * Show change password modal
     */
    public changePasswordModal(): void {
        this.modalService.showModal('changePassword');
    }

    /**
     * Show modal with additional banking info fields
     */
    public addBankingInformation(): void {
        this.modalService.showModal({
            id: 'add-profile-info',
            modifier: 'add-profile-info',
            componentName: 'user.wlc-add-profile-info',
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

    /**
     * Change notification via email state
     *
     * @param checked {boolean}
     */
    public async notificationToggle(checked: boolean): Promise<void> {

        try {
            const userProfile = {
                // for wlc_core old versions
                extProfile: {
                    dontSendEmail: !checked,
                    sendEmail: checked,
                },
                emailAgree: checked,
            };

            await this.userService.updateProfile(userProfile, true);
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
