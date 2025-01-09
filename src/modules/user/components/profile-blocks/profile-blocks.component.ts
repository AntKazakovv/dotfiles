import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {BehaviorSubject, Subject, from} from 'rxjs';
import {
    takeUntil,
    first,
    filter,
    map,
    distinctUntilChanged,
    distinctUntilKeyChanged,
} from 'rxjs/operators';

import {
    AbstractComponent,
    ModalService,
    ValidatorType,
    ICheckboxCParams,
    EventService,
    NotificationEvents,
    IPushMessageParams,
    IFormComponent,
    InjectionService,
} from 'wlc-engine/modules/core';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {IAddProfileInfoCParams} from 'wlc-engine/modules/user/components/add-profile-info/add-profile-info.params';
import {
    TwoFactorAuthService,
} from 'wlc-engine/modules/user/submodules/two-factor-auth/system/services/two-factor-auth/two-factor-auth.service';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import {UserHelper} from 'wlc-engine/modules/user/system/helpers/user.helper';

import * as Params from './profile-blocks.params';

type TFieldName = 'emailAgree' | 'smsAgree';

@Component({
    selector: '[wlc-profile-blocks]',
    templateUrl: './profile-blocks.component.html',
    styleUrls: ['./styles/profile-blocks.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileBlocksComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IProfileBlocksCParams;
    public override $params: Params.IProfileBlocksCParams;
    public toggleEmailBtn: ICheckboxCParams = this.generateToggleBtn('notification-email', 'emailAgree');
    public toggleSmsBtn: ICheckboxCParams = this.generateToggleBtn('notification-sms', 'smsAgree');
    public isDefaultUser: boolean = false;
    public use2FAGoogle: boolean = false;
    public enabled2FAGoogle = new BehaviorSubject<boolean>(false);
    public lockLink: boolean = false;
    public useAutoLogout: boolean = false;

    protected twoFactorAuthService?: TwoFactorAuthService;

    protected isConfigServiceReady = new Subject();
    protected isUserProfileReady = new Subject();

    constructor(
        @Inject('injectParams') protected params: Params.IProfileBlocksCParams,
        protected userService: UserService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected injectionService: InjectionService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        from(this.configService.ready)
            .subscribe(() => this.isConfigServiceReady.next(true));

        this.userService.userProfile$
            .pipe(first((profile: UserProfile): boolean => !!profile))
            .subscribe((profile) => 
                this.isDefaultUser = profile.type === 'default');


        this.userService.userProfile$
            .pipe(
                filter((profile: UserProfile): boolean => !!profile),
                distinctUntilKeyChanged('emailAgree'),
                takeUntil(this.$destroy),
            ).subscribe((profile: UserProfile): void => {
                this.toggleEmailBtn.control.setValue(profile.emailAgree);
            });

        this.userService.userProfile$.pipe(
            filter((profile: UserProfile): boolean => !!profile),
            distinctUntilKeyChanged('smsAgree'),
            takeUntil(this.$destroy),
        ).subscribe((profile: UserProfile): void => {
            this.toggleSmsBtn.control.setValue(profile.smsAgree);
        });

        this.use2FAGoogle = this.configService.get<boolean>('appConfig.siteconfig.Enable2FAGoogle');
        if (this.use2FAGoogle) {
            this.twoFactorAuthService = inject(TwoFactorAuthService);
            this.setStatus2FAGoogle();
            this.initSubscribers();
        }

        if (this.configService.get<string>('appConfig.license') === 'italy'
            || this.configService.get('$base.profile.autoLogout.use')
        ) {
            this.useAutoLogout = true;
        }
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

            case 'auto-logout':
                UserHelper.showAutoLogoutFormModal(this.modalService, this.userService);
                break;
        }
    }

    /**
     * Change notification via email state
     *
     * @param checked {boolean}
     */
    protected async notificationToggle(fieldName: TFieldName, checked: boolean): Promise<void> {
        try {
            await this.userService.updateProfile({
                [fieldName]: checked,
            }, {updatePartial: true});
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

    protected openModalEnable2FA(): void {
        this.twoFactorAuthService.openModalEnable();
    }

    protected openModalDisable2FA(): void {
        this.twoFactorAuthService.openModalDisable(() => this.setLockLink(true));
    }

    protected setStatus2FAGoogle(): void {
        from(this.twoFactorAuthService.getUserInfo())
            .subscribe(({enabled2FAGoogle}) =>
                this.enabled2FAGoogle.next(enabled2FAGoogle));
    }

    protected setLockLink(value: boolean): void {
        this.lockLink = value;
        this.cdr.markForCheck();
    }

    protected initSubscribers(): void {
        this.eventService.subscribe({
            name: 'ENABLE_2FA_GOOGLE',
        }, () => {
            this.setLockLink(true);
        }, this.$destroy);
        this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'}).pipe(
            filter((v) => !!v),
            map((v) => v.enabled2FAGoogle),
            distinctUntilChanged(),
            takeUntil(this.$destroy),
        ).subscribe((enabled2FAGoogle: boolean) => {
            this.enabled2FAGoogle.next(enabled2FAGoogle);
            this.setLockLink(false);
        });
    }

    protected generateToggleBtn(toggleName: string, fieldName: TFieldName): ICheckboxCParams {
        return {
            name: toggleName,
            theme: 'toggle',
            control: new UntypedFormControl(),
            onChange: (checked: boolean): void => {
                this.notificationToggle(fieldName, checked);
            },
        };
    }
}
