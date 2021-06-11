import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {Validators} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService, ICountry, IInputCParams, ISelectCParams, SelectValuesService} from 'wlc-engine/modules/core';
import {ISelectOptions} from 'wlc-engine/modules/core/components/select/select.params';
import {UserService} from 'wlc-engine/modules/user/system/services';

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
    protected autoCodePhone: ISelectOptions;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPhoneFieldCParams,
        protected configService: ConfigService,
        protected selectValues: SelectValuesService,
        protected cdr: ChangeDetectorRef,
        protected user: UserService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.provideParams();

        this.user.userProfile$.subscribe((profile => {
            if (!profile?.countryCode && !this.$params.phoneCode.control.value) {
                this.configService.get<BehaviorSubject<ICountry[]>>('countries').subscribe(data => {
                    const country = _find(data, (item) => {
                        return this.configService.get<string>('appConfig.country') === item?.value;
                    });
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
        }));

        this.$params.phoneCode?.control?.valueChanges.subscribe(val => {
            if (val) {
                this.setValidators(val);
            }
        });

        this.$params.phoneNumber?.control?.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
            this.$params.phoneNumber.control.updateValueAndValidity({onlySelf: true});
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
        this.$params.phoneNumber.control.setValidators([Validators.minLength(min), Validators.required]);
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
