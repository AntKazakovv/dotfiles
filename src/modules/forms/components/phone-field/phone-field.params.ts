import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    IInputCParams,
    ISelectCParams,
} from 'wlc-engine/modules/core';
import {ProhibitedPatterns} from 'wlc-engine/modules/core/constants';

export type ComponentTheme = 'default' | 'vertical' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = 'one-line' | string;
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
    componentName: 'wlc-phone-field',
    moduleName: 'forms',
    class: 'wlc-phone-field',
    phoneCode: <ISelectCParams>{
        labelText: gettext('Phone'),
        wlcElement: 'block_phoneCode',
        common: {
            placeholder: gettext('Code'),
            type: 'tel',
        },
        locked: true,
        name: 'phoneCode',
        validators: ['required'],
        options: 'phoneCodes',
        autoSelect: true,
    },
    phoneNumber: <IInputCParams>{
        common: {
            placeholder: gettext('Phone number'),
            type: 'tel',
        },
        wlcElement: 'block_phoneNumber',
        name: 'phoneNumber',
        validators: ['required'],
        locked: true,
        prohibitedPattern: ProhibitedPatterns.notNumberSymbols,
    },
};
