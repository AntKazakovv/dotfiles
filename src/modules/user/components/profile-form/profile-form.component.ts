import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';

import _assign from 'lodash-es/assign';
import _isObject from 'lodash-es/isObject';

import {
    ConfigService,
    EventService,
    IIndexing,
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {ProfileFormAbstract} from 'wlc-engine/modules/user/system/classes/profile-form.abstract';

import * as Params from './profile-form.params';

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
export class ProfileFormComponent extends ProfileFormAbstract implements OnInit {
    @Input() protected inlineParams: Params.IProfileFormCParams;
    public $params: Params.IProfileFormCParams;
    public userProfile = this.userService.userProfile$;
    public errors$: BehaviorSubject<IIndexing<string>> = new BehaviorSubject(null);

    constructor(
        @Inject('injectParams') protected params: Params.IProfileFormCParams,
        protected userService: UserService,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected configService: ConfigService,
    ) {
        super(
            {
                injectParams: params,
                defaultParams: configService.get<boolean>('$base.site.useLogin')
                    ? Params.generateConfig(true)
                    : Params.generateConfig(),
            },
            eventService,
            configService,
        );
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        await this.configService.ready;
    }

    /**
     * Save profile form
     *
     * @param form {FormGroup}
     * @returns save status
     */
    public async ngSubmit(form: FormGroup): Promise<boolean> {
        this.userService.updateForm$.next(true);
        const {pep} = form.value;
        delete form.value['pep'];
        if (pep) {
            form.value.extProfile = _assign({}, form.value.extProfile, {pep});
        }

        const result = await this.userService.updateProfile(form.value, false);

        if (result === true) {
            form.controls.password?.setValue('');
            form.controls.newPasswordRepeat?.setValue('');
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

            if (_isObject(result.errors)) {
                this.errors$.next(result.errors as IIndexing<string>);
            }

            return false;
        }
    }
}
