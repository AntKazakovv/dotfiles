import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService, EventService, ModalService} from 'wlc-engine/modules/core/system/services';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {IPushMessageParams, NotificationEvents} from 'wlc-engine/modules/core/system/services/notification';
import {ICheckboxCParams} from 'wlc-engine/modules/core';

import * as Params from './profile-form.params';

import {
    find as _find,
} from 'lodash-es';
import {IFormComponent} from "wlc-engine/modules/core/components/form-wrapper/form-wrapper.component";


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
}
