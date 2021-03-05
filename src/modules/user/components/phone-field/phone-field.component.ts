import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {Validators} from '@angular/forms';
import {BehaviorSubject} from "rxjs";
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService, ICountry, IInputCParams, ISelectCParams, SelectValuesService} from 'wlc-engine/modules/core';
import {ISelectOptions} from 'wlc-engine/modules/core/components/select/select.params';
import {UserService} from "wlc-engine/modules/user/system/services";

import * as Params from './phone-field.params';

import {
    clone as _clone,
    find as _find,
    assign as _assign,
} from 'lodash-es';
import IMask from "imask";

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

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.user.userProfile$.subscribe((profile => {
            if (profile) {

                if (!profile.countryCode && !this.$params.phoneCode.control.value) {

                    this.configService.get<BehaviorSubject<ICountry[]>>('countries').subscribe(data => {
                        const country = _find(data, (item) => {
                            return this.configService.get<string>('appConfig.country') === item?.value;
                        });
                        if (country) {
                            this.$params.phoneCode.control.setValue(`+${+(country.phoneCode)}`);
                            this.$params.phoneCode.control.updateValueAndValidity({onlySelf: true});
                        }
                    });
                    this.cdr.detectChanges();
                }
            }
        }));


        setTimeout(() => {
            this.$params.phoneNumber.control.markAsUntouched();
            this.$params.phoneNumber.control.markAsPristine();
        });

        this.$params.phoneCode.control.valueChanges.subscribe(val => {
            if (val) {
                this.setValidators(val);
            }
        });
    }

    protected setValidators(value: string): void {
        const lengths = this.selectValues.getPhoneLimitsDefault()[value];
        const max = lengths?.maxLength || 13;

        this.$params.phoneNumber.maskOptions = _assign(this.$params.phoneNumber.maskOptions, {
            mask: '0'.repeat(max),
        });

        this.$params.phoneCode = _clone(this.$params.phoneCode);
        this.$params.phoneNumber = _clone(this.$params.phoneNumber);

        this.cdr.detectChanges();
    }
}
