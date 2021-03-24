import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    IInputCParams,
    ISelectCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IPhoneFieldCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    phoneCode: ISelectCParams;
    phoneNumber: IInputCParams;
}

export let defaultParams: Partial<IPhoneFieldCParams> = {
    class: 'wlc-phone-field',
    phoneCode: <ISelectCParams>{
        labelText: gettext('Phone'),
        wlcElement: 'block_phoneCode',
        common: {
            placeholder: gettext('Phone Code'),
        },
        locked: true,
        name: 'phoneCode',
        validators: ['required'],
        options: 'phoneCodes',
    },
    phoneNumber: {
        common: {
            placeholder: gettext('Phone number'),
            type: 'text',
        },
        wlcElement: 'block_phoneNumber',
        name: 'phoneNumber',
        locked: true,
        validators: [
            'required',
        ],
        maskOptions: {
            mask: new RegExp(/^\d{0,13}$/),
        },
    },
};
