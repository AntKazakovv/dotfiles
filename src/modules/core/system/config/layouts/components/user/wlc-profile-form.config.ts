import {
    ILayoutComponent,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {
    IFormWrapperCParams,
    IInputCParams,
    ISelectCParams,
    IWrapperCParams,
    IFormComponent,
} from 'wlc-engine/modules/core';
import {IProfileFormCParams} from 'wlc-engine/modules/user';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {ProhibitedPatterns} from 'wlc-engine/modules/core/constants/regexp.constants';
import {ITwoFactorAuthProfileBlockCParams} from 'wlc-engine/modules/user/submodules/two-factor-auth/';
import {
    INotificationSettingsCParams,
} from 'wlc-engine/modules/user/components/notification-settings/notification-settings.params';

import _cloneDeep from 'lodash-es/cloneDeep';

const insertLogin = (useLogin: boolean): IFormComponent | null => {
    if (useLogin) {
        return FormElements.login;
    }

    return null;
};

const securityBlock: IFormComponent = {
    name: 'two-factor-auth.wlc-two-factor-auth-profile-block',
    params: <ITwoFactorAuthProfileBlockCParams>{},
};

const insertSecurityBlock = (use2FAGoogle: boolean): IFormComponent | null => {
    return use2FAGoogle ? securityBlock : null;
};

const autoLogoutBlock: IFormComponent = {
    name: 'core.wlc-wrapper',
    blockName: 'auto-logout-block',
    params: <IWrapperCParams>{
        wlcElement: 'profile_form_auto-logout',
        class: 'wlc-profile-form__block wlc-profile-form__block--auto-logout',
        components: [
            {
                name: 'core.wlc-title',
                params: {
                    mainText: gettext('Automatic logout'),
                    wlcElement: 'header_edit-auto-logout',
                },
            },
            {
                name: 'user.wlc-auto-logout-profile-block',
                params: {},
            },
        ],
    },
};

const insertAutoLogout = (isAutoLogout: boolean): IFormComponent | null => {
    return isAutoLogout ? autoLogoutBlock : null;
};

export namespace wlcProfileForm {
    export const generateFirstProfileConfig = (
        useLogin: boolean,
        use2FAGoogle: boolean,
        useAutoLogout: boolean,
    ): IFormWrapperCParams => {
        return {
            isStrictLocked: true,
            components: [
                {
                    name: 'core.wlc-wrapper',
                    params: <IWrapperCParams>{
                        wlcElement: 'profile_form_main',
                        class: 'wlc-profile-form__block wlc-profile-form__block--main',
                        components: [
                            {
                                name: 'core.wlc-title',
                                params: {
                                    mainText: gettext('Main info'),
                                    wlcElement: 'header_edit-main-info',
                                },
                            },
                            FormElements.firstName,
                            FormElements.lastName,
                            FormElements.profileMail,
                            insertLogin(useLogin),
                            {
                                name: FormElements.mobilePhone.name,
                                params: {
                                    ...FormElements.mobilePhone.params,
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
                            FormElements.birthDate,
                            FormElements.gender,
                            FormElements.pep,
                        ],
                    },
                },
                {
                    name: 'core.wlc-wrapper',
                    params: <IWrapperCParams>{
                        wlcElement: 'profile_form_location',
                        class: 'wlc-profile-form__block wlc-profile-form__block--location',
                        components: [
                            {
                                name: 'core.wlc-title',
                                params: {
                                    mainText: gettext('Location'),
                                    wlcElement: 'header_edit-location',
                                },
                            },
                            GlobalHelper.mergeConfig(
                                _cloneDeep(FormElements.countryAndState),
                                {
                                    params: {
                                        theme: 'vertical',
                                    },
                                },
                            ),
                            {
                                name: FormElements.postalCode.name,
                                params: {
                                    ...FormElements.postalCode.params,
                                    validators: null,
                                },
                            },
                            FormElements.city,
                            {
                                name: FormElements.address.name,
                                params: {
                                    ...FormElements.address.params,
                                    validators: [
                                        {
                                            name: 'onlyLatinLetters',
                                            projectType: 'wlc',
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
                {
                    name: 'core.wlc-wrapper',
                    params: <IWrapperCParams>{
                        wlcElement: 'profile_form_banking-information',
                        class: 'wlc-profile-form__block wlc-profile-form__block--banking',
                        components: [
                            {
                                name: 'core.wlc-title',
                                params: {
                                    mainText: gettext('Banking information'),
                                    wlcElement: 'header_edit-banking-information',
                                },
                            },
                            {
                                name: FormElements.bankNameText.name,
                                params: {
                                    ...FormElements.bankNameText.params,
                                    validators: null,
                                },
                            },
                            {
                                name: FormElements.branchCode.name,
                                params: {
                                    ...FormElements.branchCode.params,
                                    validators: null,
                                },
                            },
                            {
                                name: FormElements.swift.name,
                                params: {
                                    ...FormElements.swift.params,
                                    validators: null,
                                },
                            },
                            {
                                name: FormElements.ibanNumber.name,
                                params: {
                                    ...FormElements.ibanNumber.params,
                                    validators: null,
                                },
                            },
                        ],
                    },
                },
                {
                    name: 'core.wlc-wrapper',
                    params: <IWrapperCParams>{
                        wlcElement: 'profile_form_subscriptions',
                        class: 'wlc-profile-form__block wlc-profile-form__block--subscriptions',
                        components: [
                            {
                                name: 'core.wlc-title',
                                params: {
                                    mainText: gettext('Subscriptions'),
                                    wlcElement: 'header_edit-subscriptions',
                                },
                            },
                            {
                                name: 'user.wlc-notification-settings',
                                params: <INotificationSettingsCParams>{},
                            },
                        ],
                    },
                },
                insertSecurityBlock(use2FAGoogle),
                insertAutoLogout(useAutoLogout),
                {
                    name: 'core.wlc-wrapper',
                    blockName: 'password-block',
                    params: <IWrapperCParams>{
                        wlcElement: 'profile_form_password',
                        class: 'wlc-profile-form__block wlc-profile-form__block--password',
                        components: [
                            {
                                name: 'core.wlc-title',
                                params: {
                                    mainText: gettext('Password'),
                                    wlcElement: 'header_edit-password',
                                },
                            },
                            FormElements.password,
                            {
                                name: 'core.wlc-wrapper',
                                params: <IWrapperCParams>{
                                    class: 'wlc-profile-form__block',
                                    components: [
                                        FormElements.passwordNew,
                                        FormElements.passwordConfirm,
                                    ],
                                },
                            },
                        ],
                    },
                },
                {
                    name: 'core.wlc-wrapper',
                    params: <IWrapperCParams>{
                        wlcElement: 'profile_form_submit',
                        class: 'wlc-profile-form__block wlc-profile-form__block--submit',
                        components: [
                            FormElements.submit,
                        ],
                    },
                },
            ],
            validators: [
                {
                    name: 'matchingFields',
                    options: ['password', 'newPasswordRepeat'],
                },
            ],
        };
    };

    export const generateDefaultProfileConfig = (useLogin: boolean): IFormWrapperCParams => {
        return {
            isStrictLocked: true,
            components: [
                {
                    name: 'user.wlc-email-field',
                    params: {
                        name: ['email'],
                        theme: 'vertical',
                        common: {
                            placeholder: gettext('E-mail'),
                        },
                        email: {
                            common: {
                                tooltipIcon: 'verified-icon',
                                tooltipMod: 'resolve',
                                tooltipText: gettext('Email is verified'),
                            },
                        },
                        wlcElement: 'block_email',
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
                        prohibitedPattern: ProhibitedPatterns.notNamesSymbols,
                        validators: [
                            'required',
                            {
                                name: 'onlyLatinLetters',
                                projectType: 'wlc',
                            },
                        ],
                        exampleValue: gettext('First name'),
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
                        prohibitedPattern: ProhibitedPatterns.notNamesSymbols,
                        validators: [
                            'required',
                            {
                                name: 'onlyLatinLetters',
                                projectType: 'wlc',
                            },
                        ],
                        exampleValue: gettext('Last name'),
                    },
                },
                {
                    name: 'core.wlc-select',
                    params: <ISelectCParams>{
                        labelText: gettext('Gender'),
                        wlcElement: 'block_gender',
                        common: {
                            placeholder: gettext('Gender'),
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
                FormElements.countryAndState,
                {
                    name: 'core.wlc-input',
                    params: <IInputCParams>{
                        ...FormElements.city.params,
                        theme: 'default',
                        customMod: [],
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
                        validators: [
                            {
                                name: 'onlyLatinLetters',
                                projectType: 'wlc',
                            },
                        ],
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
                FormElements.pep,
                {
                    name: 'forms.wlc-phone-field',
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
                            typeAttr: 'submit',
                        },
                    },
                },
            ],
        };
    };

    export const def: ILayoutComponent = {
        name: 'user.wlc-profile-form',
    };

    export const kiosk: ILayoutComponent = {
        name: 'user.wlc-profile-form',
        params: <IProfileFormCParams>{
            config: <IFormWrapperCParams>{
                class: 'wlc-form-wrapper',
                isStrictLocked: true,
                components: [
                    {
                        name: 'core.wlc-wrapper',
                        params: <IWrapperCParams>{
                            class: 'wlc-profile-form__block wlc-profile-form__block--password',
                            components: [
                                {
                                    name: 'core.wlc-title',
                                    params: {
                                        mainText: gettext('Password'),
                                        wlcElement: 'header_edit-password',
                                    },
                                },
                                FormElements.password,
                                {
                                    name: 'core.wlc-wrapper',
                                    params: <IWrapperCParams>{
                                        class: 'wlc-profile-form__block',
                                        components: [
                                            FormElements.passwordNew,
                                            FormElements.passwordConfirm,
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        name: 'core.wlc-wrapper',
                        params: <IWrapperCParams>{
                            class: 'wlc-profile-form__block wlc-profile-form__block--submit',
                            components: [
                                FormElements.submit,
                            ],
                        },
                    },
                ],
                validators: [
                    {
                        name: 'matchingFields',
                        options: ['password', 'newPasswordRepeat'],
                    },
                ],
            },
        },
    };
}
