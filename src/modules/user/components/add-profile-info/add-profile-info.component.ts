import {BehaviorSubject} from 'rxjs';
import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {StateService} from '@uirouter/core';

import _each from 'lodash-es/each';
import _assign from 'lodash-es/assign';
import _cloneDeep from 'lodash-es/cloneDeep';
import _isString from 'lodash-es/isString';

import {
    EventService,
    ModalService,
    SelectValuesService,
    IPushMessageParams,
    NotificationEvents,
    IIndexing,
    IFormWrapperCParams,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';

import {ProfileFormAbstract} from 'wlc-engine/modules/user/system/classes/profile-form.abstract';

import * as Params from './add-profile-info.params';

@Component({
    selector: '[wlc-add-profile-info]',
    templateUrl: './add-profile-info.component.html',
    styleUrls: ['./styles/add-profile-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AddProfileInfoComponent extends ProfileFormAbstract implements OnInit {
    @Input() protected inlineParams: Params.IAddProfileInfoCParams;

    public override $params: Params.IAddProfileInfoCParams;
    public errors$: BehaviorSubject<IIndexing<string>> = new BehaviorSubject(null);
    public formConfig: IFormWrapperCParams;
    protected isPending: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAddProfileInfoCParams,
        protected userService: UserService,
        protected modalService: ModalService,
        eventService: EventService,
        protected stateService: StateService,
        protected selectService: SelectValuesService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, eventService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.disableStatesControl();
        this.setFormConfig();

        this.updateFormForMetamask().then((isChanged: boolean): void => {
            if (isChanged) {
                this.cdr.markForCheck();
            }
        });
    }

    public async onSubmit(form: UntypedFormGroup): Promise<boolean> {
        if (this.isPending) {
            return false;
        }
        let submited: boolean;
        this.isPending = true;
        this.modalService.showModal('data-is-processing');

        const formValues: IIndexing<any> = _cloneDeep(form.value);

        if (formValues.logoutTime) {
            formValues.extProfile = {
                logoutTime: formValues.logoutTime,
            };
            delete formValues.logoutTime;
        }

        const response = await this.userService.updateProfile(formValues, {
            updatePartial: true,
            isAfterDepositWithdraw: false,
            requestConfirmation: true,
        });

        if (response.status === 'success') {
            this.modalService.hideModal('data-is-processing');
            this.modalService.hideModal('add-profile-info');

            if (this.$params.redirect?.success) {
                this.stateService.go(this.$params.redirect.success.to, this.$params.redirect.success.params);
            }

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Profile updated successfully'),
                    message: gettext('Your profile has been updated successfully'),
                    wlcElement: 'notification_profile-update-success',
                },
            });

            submited = true;
        } else {

            const messages = [gettext('Failed to save the profile')];
            const {errors} = response;

            if (errors) {
                if (_isString(errors)) {
                    messages.push(errors);
                } else {
                    _each(errors, (error): void => {
                        messages.push(String(error));
                    });

                    if (!Array.isArray(errors)) {
                        this.errors$.next(response.errors as IIndexing<string>);
                    }
                }
            }

            this.modalService.hideModal('data-is-processing');

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Profile update failed'),
                    message: messages,
                    wlcElement: 'notification_profile-update-error',
                },
            });

            submited = false;
        }

        this.isPending = false;
        this.cdr.markForCheck();
        return submited;
    }

    protected disableStatesControl(): void {
        this.selectService.countryStates$.next([{value: '', title: 'Please select country'}]);

        this.eventService.subscribe(
            {name: 'COUNTRY_STATES'},
            () => {
                this.$params.formConfig = _assign({}, this.$params.formConfig);
            },
            this.$destroy,
        );
    }

    protected setFormConfig(): void {
        const formConfig = _cloneDeep(this.$params.formConfig);
        const checkPassOnUpdate = this.configService.get<number>('appConfig.checkPassOnUpdate');

        if (checkPassOnUpdate === 0) {
            formConfig.components = formConfig.components.filter(
                component => !(
                    component.name === 'core.wlc-input' && (component.params?.name as string) === 'currentPassword'
                ),
            );
        }

        this.formConfig = formConfig;
    }
}
