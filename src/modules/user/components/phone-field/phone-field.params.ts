import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    IInputCParams,
    ISelectCParams,
    ProhibitedPatterns,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IPhoneFieldCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    /**
     * PhoneCode field settings
     */
    phoneCode: ISelectCParams;
    /**
     * PhoneNumber field settings
     */
    phoneNumber: IInputCParams;
    /**
     * Show verification detail
     */
    showVerification?: boolean;
    /**
     * Disable required validator phoneNumber for registration
     */
    notRequiredPhone?: boolean,
}

export let defaultParams: Partial<IPhoneFieldCParams> = {
    class: 'wlc-phone-field',
    phoneCode: <ISelectCParams>{
        labelText: gettext('Phone'),
        wlcElement: 'block_phoneCode',
        common: {
            placeholder: gettext('Code'),
        },
        locked: true,
        name: 'phoneCode',
        validators: ['required'],
        options: 'phoneCodes',
        autoSelect: false,
    },
    phoneNumber: {
        common: {
            placeholder: gettext('Phone number'),
            type: 'text',
        },
        wlcElement: 'block_phoneNumber',
        name: 'phoneNumber',
        validators: ['required'],
        locked: true,
        prohibitedPattern: ProhibitedPatterns.notNumberSymbols,
    },
};
