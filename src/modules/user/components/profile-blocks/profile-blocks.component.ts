import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {FormControl} from '@angular/forms';

import {
    takeUntil,
    first,
    distinct,
} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
    ModalService,
    ValidatorType,
    ICheckboxCParams,
    EventService,
    NotificationEvents,
    IPushMessageParams,
    IFormComponent,
} from 'wlc-engine/modules/core';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {IAddProfileInfoCParams} from 'wlc-engine/modules/user/components/add-profile-info/add-profile-info.params';

import * as Params from './profile-blocks.params';

@Component({
    selector: '[wlc-profile-blocks]',
    templateUrl: './profile-blocks.component.html',
    styleUrls: ['./styles/profile-blocks.component.scss'],
})
export class ProfileBlocksComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IProfileBlocksCParams;
    public $params: Params.IProfileBlocksCParams;
    public toggleBtn: ICheckboxCParams = {
        name: 'notification',
        type: 'toggle',
        control: new FormControl(),
        onChange: (checked: boolean): void => {
            this.notificationToggle(checked);
        },
    };
    public isDefaultUser: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.IProfileBlocksCParams,
        protected userService: UserService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected configService: ConfigService,
        protected eventService: EventService,
    ) {
        super(
            {injectParams: params, defaultParams: Params.defaultParams},
            configService,
        );
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        await this.configService.ready;
        await this.userService.userProfile$.pipe(
            first((profile: UserProfile): boolean => !!profile),
        ).toPromise();
        this.isDefaultUser = this.userService.userProfile.type === 'default';

        this.userService.userProfile$.pipe(
            takeUntil(this.$destroy),
            distinct((profile: UserProfile): boolean => profile.emailAgree),
        ).subscribe((profile: UserProfile): void => {
            this.toggleBtn.control.setValue(profile.emailAgree);
        });
    }

    /**
     * Open modal by name
     *
     * @param name modal name
     */
    public async openModal(name: string): Promise<void> {
        switch (name) {
            case 'change-password':
                this.modalService.showModal('changePassword');
                break;

            case 'add-profile-info':
                const components: (IFormComponent | Params.IFieldComponentParams)[] = [
                    this.changeValidators(FormElements.bankNameText, []),
                    this.changeValidators(FormElements.branchCode, []),
                    this.changeValidators(FormElements.swift, []),
                    this.changeValidators(FormElements.ibanNumber, []),
                ];

                if (!await this.configService.get<Promise<boolean>>('$user.skipPasswordOnFirstUserSession')) {
                    components.push(FormElements.password);
                }

                components.push(FormElements.submit);

                this.modalService.showModal({
                    id: 'add-profile-info',
                    modifier: 'add-profile-info',
                    componentName: 'user.wlc-add-profile-info',
                    componentParams: <IAddProfileInfoCParams>{
                        title: gettext('Banking information'),
                        formConfig: {
                            class: 'wlc-form-wrapper',
                            components,
                        },
                        formData: this.userService.userProfile$,
                    },
                    showFooter: false,
                    backdrop: true,
                });
                break;
        }
    }

    /**
     * Change notification via email state
     *
     * @param checked {boolean}
     */
    protected async notificationToggle(checked: boolean): Promise<void> {
        try {
            await this.userService.updateProfile({
                // for wlc_core old versions
                extProfile: {
                    dontSendEmail: !checked,
                    sendEmail: checked,
                },
                emailAgree: checked,
            }, true);
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Profile update failed'),
                    message: error,
                    wlcElement: 'notification_profile-update-error',
                },
            });
        }
    }

    /**
     * Set validator for component
     *
     * @param componentParams form element params
     * @param newValidators validators
     * @returns {Params.IFieldComponentParams}
     */
    protected changeValidators(
        componentParams: Params.IFieldComponentParams,
        newValidators: ValidatorType[],
    ): Params.IFieldComponentParams {
        componentParams.params.validators = newValidators;
        return componentParams;
    }
}
