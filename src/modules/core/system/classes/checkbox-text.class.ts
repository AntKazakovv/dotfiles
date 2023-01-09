import {
    Inject,
    Injectable,
} from '@angular/core';

import _cloneDeep from 'lodash-es/cloneDeep';
import _isObject from 'lodash-es/isObject';
import _isString from 'lodash-es/isString';
import _assign from 'lodash-es/assign';

import {ConfigService} from 'wlc-engine/modules/core/system/services';
import {IBaseConfig} from 'wlc-engine/modules/core/system/interfaces';
import {ILegalCheckboxWithLink} from 'wlc-engine/modules/core/components/checkbox/checkbox.params';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers';
import {CuracaoRequirement} from 'wlc-engine/modules/app/system';

@Injectable()
export class CheckBoxTexts {

    private _defaultText: IBaseConfig['legal'] = {
        termsCheckboxText: {
            prefix: gettext('I agree with'),
            linkText: gettext('Terms and Conditions'),
            slug: 'terms-and-conditions',
        },
        termsWlcCuracaoCheckboxText: {
            prefix: gettext('I have read and accepted the'),
            linkText: gettext('Terms and Conditions'),
            slug: 'terms-and-conditions',
        },
        ageCheckboxText: gettext('I confirm that I\'m 18 years or older'),
        ageWlcCuracaoCheckboxText: gettext('I am 18 years or older and not a resident of the restricted territories'),
        selfExcludedCheckboxText: gettext('I have not self-excluded from any gambling website in the past 12 months'),
        paymentRulesText: {
            prefix: gettext('I have read and agree to the payment'),
            linkText: gettext('system restrictions'),
            slug: 'terms-and-conditions',
            urlHook: 'item-8',
            target: '_blank',
        },
        privacyPolicyText: {
            prefix: gettext('I agree with'),
            linkText: gettext('Privacy Policy'),
            slug: 'privacy-policy',
        },
    };

    private _texts: IBaseConfig['legal'];

    constructor(
        private configService: ConfigService,
        @Inject(CuracaoRequirement) private enableRequirement: boolean,
    ) {
        this._texts = GlobalHelper.mergeConfig(
            this._defaultText,
            this.configService.get<IBaseConfig['legal']>('$base.legal'),
        );
    }

    /**
     * It returns a checkbox text params by checkbox type
     *
     * @param {keyof IBaseConfig['legal']} key - checkbox type
     * @returns {ILegalCheckboxWithLink | string} - params value
     */
    public get(key: keyof IBaseConfig['legal']): ILegalCheckboxWithLink | string {
        key = this.getKey(key);
        return _cloneDeep(this._texts[key]);
    }

    /**
     * It update the value of a checkbox text params
     *
     * @param {keyof IBaseConfig['legal']} key - checkbox type
     * @param {Partial<ILegalCheckboxWithLink> | string} value - The value to set.
     */
    public set(key: keyof IBaseConfig['legal'], value: Partial<ILegalCheckboxWithLink> | string): void {
        key = this.getKey(key);
        if (_isObject(value) && _isObject(this._texts[key])) {
            _assign(this._texts[key], value);
        } else if (_isString(this._texts[key]) && _isString(value)) {
            this._texts[key] = value;
        }
    }

    private getKey(key: keyof IBaseConfig['legal']): keyof IBaseConfig['legal'] {
        if (this.enableRequirement) {
            switch (key) {
                case 'ageCheckboxText':
                    return 'ageWlcCuracaoCheckboxText';

                case 'termsCheckboxText':
                    return 'termsWlcCuracaoCheckboxText';
            }
        }
        return key;
    }
}
