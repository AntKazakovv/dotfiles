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
import _forEach from 'lodash-es/forEach';
import _remove from 'lodash-es/remove';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
    ConfigService,
    EventService,
    IIndexing,
    IPushMessageParams,
    NotificationEvents,
    ProfileType,
    IFormComponent,
    IFormWrapperCParams,
    ValidatorType,
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
    public ready: boolean = false;

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
                defaultParams: Params.generateDefaultParams(
                    configService.get<ProfileType>('$base.profile.type'),
                    configService.get<boolean>('$base.site.useLogin'),
                ),
            },
            eventService,
            configService,
        );
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        await this.configService.ready;

        if (await this.configService.get<boolean>('$user.skipPasswordOnFirstUserSession')) {
            this.$params.config = this.changePassBlock();
        }

        this.ready = true;
        this.cdr.detectChanges();
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

    protected changePassBlock(): IFormWrapperCParams {
        const configClone = _cloneDeep(this.$params.config);
        this.findAndDeletePassBlock(configClone.components);
        if (this.configService.get<ProfileType>('$base.profile.type') === 'first') {
            _remove(configClone.validators, (validator: ValidatorType): boolean => {
                return (typeof validator !== 'string') && (validator.name === 'matchingFields');
            });
        }

        return configClone;
    }

    protected findAndDeletePassBlock(components: IFormComponent[], parent?: IFormComponent): void {
        _forEach(components, (component: IFormComponent): void | false => {
            if (!component) return;

            if (component.name === 'core.wlc-wrapper') {
                this.findAndDeletePassBlock(component.params.components, component);
                return;
            }

            if (component.params.name === 'currentPassword') {
                if (this.configService.get<ProfileType>('$base.profile.type') === 'first') {
                    parent.params.components = [
                        {
                            name: 'core.wlc-button',
                            params: {
                                class: 'wlc-btn',
                                common: {
                                    text: gettext('Change password'),
                                    typeAttr: 'button',
                                    event: {
                                        name: 'SHOW_MODAL',
                                        data: 'changePassword',
                                    },
                                },
                            },
                        },
                    ];
                } else {
                    _remove(components, (comp: IFormComponent): boolean => comp?.params.name === 'currentPassword');
                }

                return false;
            }
        });
    }
}
