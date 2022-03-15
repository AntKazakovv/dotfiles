import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    IFormWrapperCParams,
    ISelectCParams,
    IInputCParams,
} from 'wlc-engine/modules/core';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type AdditionalBlockItemsType = 'emailNotification' | 'passwordRestore' | 'bankingInfo';

export interface IProfileFormCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    config: IFormWrapperCParams,
    useProfileBlocks: boolean;
}

export const insertLogin = (useLogin: boolean): IFormComponent => {
    if (useLogin) {
        return FormElements.login;
    }

    return null;
};

export const generateConfig = (useLogin: boolean = false): IProfileFormCParams => {
    return {
        class: 'wlc-profile-form',
        componentName: 'wlc-profile-form',
        moduleName: 'user',
        useProfileBlocks: false,
        config: {
            class: 'wlc-form-wrapper',
            components: [
                {
                    name: 'core.wlc-input',
                    params: <IInputCParams>{
                        common: {
                            placeholder: gettext('E-mail'),
                        },
                        wlcElement: 'block_email',
                        locked: true,
                        name: 'email',
                        validators: ['required', 'email'],
                        exampleValue: 'example@mail.com',
                    },
                },
                insertLogin(useLogin),
                {
                    name: 'core.wlc-input',
                    params: <IInputCParams>{
                        common: {
                            placeholder: gettext('First name'),
                        },
                        wlcElement: 'block_Name',
                        name: 'firstName',
                        locked: true,
                        prohibitedPattern: /[\d!"#$%&()*+,./:;<=>?@[\\\]^_{|}~¡¿÷ˆ№]/g,
                        validators: ['required'],
                        exampleValue: gettext('Enter your name'),
                    },
                },
                {
                    name: 'core.wlc-input',
                    params: <IInputCParams>{
                        common: {
                            placeholder: gettext('Last name'),
                        },
                        wlcElement: 'block_last-name',
                        name: 'lastName',
                        locked: true,
                        prohibitedPattern: /[\d!"#$%&()*+,./:;<=>?@[\\\]^_{|}~¡¿÷ˆ№]/g,
                        validators: ['required'],
                        exampleValue: gettext('Enter your last name'),
                    },
                },
                {
                    name: 'core.wlc-select',
                    params: <ISelectCParams>{
                        labelText: gettext('Sex'),
                        wlcElement: 'block_gender',
                        common: {
                            placeholder: gettext('Sex'),
                        },
                        locked: true,
                        name: 'gender',
                        validators: ['required'],
                        options: 'genders',
                    },
                },
                {
                    name: 'core.wlc-birth-field',
                    params: {
                        name: ['birthDay', 'birthMonth', 'birthYear'],
                        validators: ['required'],
                        locked: true,
                    },
                },
                {
                    name: 'core.wlc-country-and-state',
                    params: {
                        name:  ['countryCode', 'stateCode'],
                        locked: ['countryCode'],
                        validatorsField: [{
                            name: 'countryCode',
                            validators: 'required',
                        }],
                    },
                },
                {
                    name: 'core.wlc-input',
                    params: <IInputCParams>{
                        common: {
                            placeholder: gettext('City'),
                        },
                        wlcElement: 'block_city',
                        name: 'city',
                        validators: [],
                        maskOptions: 'textField',
                    },
                },
                {
                    name: 'core.wlc-input',
                    params: <IInputCParams>{
                        common: {
                            placeholder: gettext('Address'),
                        },
                        wlcElement: 'block_address',
                        name: 'address',
                        validators: [],
                    },
                },
                {
                    name: 'core.wlc-input',
                    params: <IInputCParams>{
                        common: {
                            placeholder: gettext('Postal code'),
                        },
                        wlcElement: 'block_postalcode',
                        name: 'postalCode',
                        validators: [],
                    },
                },
                {
                    name: 'core.wlc-select',
                    params: <ISelectCParams>{
                        labelText: gettext('PEP'),
                        wlcElement: 'block_pep',
                        common: {
                            placeholder: gettext('PEP'),
                            tooltipText: gettext('Politically Exposed Person'),
                        },
                        locked: true,
                        name: 'pep',
                        validators: [],
                        options: 'pep',
                    },
                },
                {
                    name: 'user.wlc-phone-field',
                    params: {
                        name: ['phoneCode', 'phoneNumber'],
                        locked: true,
                        showVerification: true,
                        phoneCode: {
                            common: {
                                tooltipIcon: 'verified-icon',
                                tooltipMod: 'resolve',
                                tooltipText: gettext('The phone has been successfully verified'),
                            },
                        },
                    },
                },
                {
                    name: 'core.wlc-input',
                    params: <IInputCParams>{
                        common: {
                            placeholder: gettext('Password'),
                            wlcElement: 'block_password',
                            type: 'password',
                            customModifiers: 'right-shift',
                            usePasswordVisibilityBtn: true,
                        },
                        name: 'currentPassword',
                        validators: ['required'],
                    },
                },
                {
                    name: 'core.wlc-button',
                    params: {
                        name: 'submit',
                        wlcElement: 'button_submit',
                        common: {
                            text: gettext('Save changes'),
                        },
                    },
                },
            ],
        },
    };
};
