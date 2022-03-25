import {ILayoutComponent} from 'wlc-engine/modules/core';
import {
    IFormWrapperCParams,
    IWrapperCParams,
} from 'wlc-engine/modules/core/components';
import {IProfileFormCParams} from 'wlc-engine/modules/user';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {insertLogin} from 'wlc-engine/modules/user/components/profile-form/profile-form.params';

export namespace wlcProfileForm {
    export const generateConfig = (useLogin: boolean = false): ILayoutComponent => {
        return {
            name: 'user.wlc-profile-form',
            params: <IProfileFormCParams>{
                useProfileBlocks: false,
                config: <IFormWrapperCParams>{
                    class: 'wlc-form-wrapper',
                    components: [
                        {
                            name: 'core.wlc-wrapper',
                            params: <IWrapperCParams>{
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
                                    FormElements.email,
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
                                    {
                                        name: FormElements.pep.name,
                                        params: {
                                            ...FormElements.pep.params,
                                            validators: null,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: <IWrapperCParams>{
                                class: 'wlc-profile-form__block wlc-profile-form__block--location',
                                components: [
                                    {
                                        name: 'core.wlc-title',
                                        params: {
                                            mainText: gettext('Location'),
                                            wlcElement: 'header_edit-location',
                                        },
                                    },
                                    FormElements.country,
                                    {
                                        name: FormElements.postalCode.name,
                                        params: {
                                            ...FormElements.postalCode.params,
                                            validators: null,
                                        },
                                    },
                                    {
                                        name: FormElements.city.name,
                                        params: {
                                            ...FormElements.city.params,
                                            validators: null,
                                            maskOptions: 'textField',
                                        },
                                    },
                                    {
                                        name: FormElements.address.name,
                                        params: {
                                            ...FormElements.address.params,
                                            validators: null,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            name: 'core.wlc-wrapper',
                            params: <IWrapperCParams>{
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
                            params: <IWrapperCParams> {
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
                                        params: <IWrapperCParams> {
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
    };

    export const def: ILayoutComponent = {
        name: 'user.wlc-profile-form',
    };

    export const kiosk: ILayoutComponent = {
        name: 'user.wlc-profile-form',
        params: <IProfileFormCParams>{
            config: <IFormWrapperCParams>{
                class: 'wlc-form-wrapper',
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
