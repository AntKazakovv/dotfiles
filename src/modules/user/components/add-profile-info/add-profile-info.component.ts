import {BehaviorSubject} from 'rxjs';
import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {StateService} from '@uirouter/core';

import _each from 'lodash-es/each';
import _assign from 'lodash-es/assign';
import _cloneDeep from 'lodash-es/cloneDeep';
import _isString from 'lodash-es/isString';

import {
    ConfigService,
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

    public $params: Params.IAddProfileInfoCParams;
    public errors$: BehaviorSubject<IIndexing<string>> = new BehaviorSubject(null);
    public formConfig: IFormWrapperCParams;
    public submitButtonPending$: BehaviorSubject<boolean>;
    protected isPending: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAddProfileInfoCParams,
        protected configService: ConfigService,
        protected userService: UserService,
        protected modalService: ModalService,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected stateService: StateService,
        protected selectService: SelectValuesService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams},
            eventService,
            configService,
        );
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.disableStatesControl();
        this.formConfig = _cloneDeep(this.$params.formConfig);

        this.updateFormForMetamask().then((isChanged: boolean): void => {
            if (isChanged) {
                this.cdr.markForCheck();
            }
        });
    }

    public async onSubmit(form: FormGroup): Promise<boolean> {
        if (this.isPending) {
            return false;
        }
        let submited: boolean;
        this.isPending = true;
        this.modalService.showModal('data-is-processing');

        const result = await this.userService.updateProfile(form.value, true, false, true);

        if (result === true) {
            this.modalService.closeAllModals();

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

            const messages = [gettext('Profile save failed')];
            if (result.errors) {
                if (_isString(result.errors)) {
                    messages.push(result.errors);
                } else {
                    _each(result.errors, (error: any): void => {
                        messages.push(String(error));
                    });
                }
                this.errors$.next(result.errors);
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
}
