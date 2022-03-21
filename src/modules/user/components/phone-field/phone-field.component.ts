import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {
    distinctUntilChanged,
    filter,
    first,
    takeUntil,
} from 'rxjs/operators';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {ICountry} from 'wlc-engine/modules/core/system/interfaces/fundist.interface';
import {IInputCParams} from 'wlc-engine/modules/core/components/input/input.params';
import {ISelectCParams} from 'wlc-engine/modules/core/components/select/select.params';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {SelectValuesService} from 'wlc-engine/modules/core/system/services/select-values/select-values.service';
import {ValidationService} from 'wlc-engine/modules/core/system/services/validation/validation.service';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {UserProfile} from 'wlc-engine/modules/user';
import {ProfileType} from 'wlc-engine/modules/core/system/interfaces/base-config/profile.interface';
import {ISelectOptions} from 'wlc-engine/modules/core/components/select/select.params';

import * as Params from './phone-field.params';

import _find from 'lodash-es/find';
import _clone from 'lodash-es/clone';

@Component({
    selector: '[wlc-phone-field]',
    templateUrl: './phone-field.component.html',
    styleUrls: ['./styles/phone-field.component.scss'],
})
export class PhoneFieldComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IPhoneFieldCParams;
    public $params: Params.IPhoneFieldCParams;
    public phoneCode: ISelectCParams;
    public phoneNumber: IInputCParams;
    public smsVerification: boolean;
    public useVerificationBtn: boolean = false;
    protected autoCodePhone: ISelectOptions;
    protected profileType: ProfileType;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPhoneFieldCParams,
        protected configService: ConfigService,
        protected selectValues: SelectValuesService,
        protected cdr: ChangeDetectorRef,
        protected userService: UserService,
        protected validationService: ValidationService,
        protected modalService: ModalService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.provideParams();

        this.profileType = this.configService.get<ProfileType>('$base.profile.type');
        this.smsVerification = this.configService.get<boolean>('$base.profile.smsVerification.useInProfile');

        const tempPhoneCode = this.configService.get('phoneCode');
        const tempPhoneNumber = this.configService.get('phoneNumber');

        this.userService.userProfile$
            .pipe(takeUntil(this.$destroy))
            .pipe(filter((profile: UserProfile): boolean => !!profile))
            .subscribe(((profile: UserProfile): void => {

                if (this.$params.showVerification && this.smsVerification) {
                    this.useVerificationBtn = !profile.phoneVerified;

                    if (this.useVerificationBtn) {
                        this.setModifiers('sms-not-verified');
                        this.removeModifiers('sms-verified');
                    } else {
                        this.setModifiers('sms-verified');
                        this.removeModifiers('sms-not-verified');
                    }
                }

                if (profile.phoneCode || tempPhoneCode) {
                    this.$params.phoneCode.control.setValue(profile.phoneCode || tempPhoneCode);
                    this.$params.phoneCode.control.updateValueAndValidity({onlySelf: true});
                } else if (!this.$params.phoneCode.control.value) {
                    this.configService.get<BehaviorSubject<ICountry[]>>('countries')
                        .pipe(first((v) => !!v.length))
                        .subscribe(data => {
                            const countryCode = profile?.countryCode ||
                                this.configService.get<string>('appConfig.country');
                            const country = _find(data, (item) => countryCode === item?.value);
                            if (country) {
                                this.$params.phoneCode.control.setValue(`+${+(country.phoneCode)}`);
                                this.$params.phoneCode.control.updateValueAndValidity({onlySelf: true});

                                setTimeout(() => {
                                    this.setValidators(`+${+(country.phoneCode)}`);
                                    this.cdr.detectChanges();
                                });
                            }
                        });
                }

                this.$params.phoneNumber.control.setValue(profile.phoneNumber || tempPhoneNumber);
                this.$params.phoneNumber.control.updateValueAndValidity({onlySelf: true});
            }));

        this.$params.phoneCode?.control?.valueChanges
            .pipe(takeUntil(this.$destroy))
            .subscribe(val => {
                if (val) {
                    this.setValidators(val);
                    this.configService.set({
                        name: 'phoneCode',
                        value: val,
                    });
                }
            });

        this.$params.phoneNumber?.control?.valueChanges
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.$destroy),
            )
            .subscribe((val) => {
                this.configService.set({
                    name: 'phoneNumber',
                    value: val,
                });
                this.$params.phoneNumber.control.updateValueAndValidity({onlySelf: true});
            });
    }

    /**
     * Show modal for sms verification
     * @returns {void}
     */
    public openSmsModal(): void {
        this.modalService.showModal({
            id: 'sms-verification',
            componentName: 'user.wlc-sms-verification',
            componentParams: {
                functional: 'profile',
            },
            modalTitle: gettext('Verify your account'),
            showFooter: false,
        });
    }

    protected setValidators(value: string): void {
        const lengths = this.selectValues.getPhoneLimitsDefault()[value];
        const min = lengths?.minLength || 6;
        const max = lengths?.maxLength || 13;

        this.$params.phoneNumber.maskOptions = {
            mask: new RegExp(`^\\d{0,${max}}$`),
        };
        this.$params.phoneNumber.control.clearValidators();
        this.$params.phoneNumber.control.setValidators(
            this.validationService.getValidator('minLength').validator(min));

        if (!this.$params.notRequiredPhone) {
            this.$params.phoneNumber.control.setValidators(this.validationService.getValidator('required').validator);
        }
        else {
            this.$params.phoneCode.validators = [];
        }
        this.$params.phoneNumber.control.updateValueAndValidity({
            onlySelf: true,
        });

        this.$params.phoneCode = _clone(this.$params.phoneCode);
        this.$params.phoneNumber = _clone(this.$params.phoneNumber);

        this.cdr.detectChanges();
    }

    protected provideParams(): void {
        this.$params.phoneCode['theme'] = this.$params.theme;
        this.$params.phoneNumber['theme'] = this.$params.theme;
    }
}

