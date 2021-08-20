import {ILayoutComponent} from 'wlc-engine/modules/core';
import {
    IFormWrapperCParams,
    IWrapperCParams,
} from 'wlc-engine/modules/core/components';
import {IProfileFormCParams} from 'wlc-engine/modules/user';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';

export namespace wlcProfileForm {
    export const def: ILayoutComponent = {
        name: 'user.wlc-profile-form',
    };

    export const one: ILayoutComponent = {
        name: 'user.wlc-profile-form',
        params: <IProfileFormCParams>{
            additionalBlocks: null,
            common: null,
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
                                {
                                    name: FormElements.mobilePhone.name,
                                    params: {
                                        ...FormElements.mobilePhone.params,
                                        validators: null,
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
                                FormElements.passwordNew,
                                FormElements.passwordConfirm,
                                FormElements.password,
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
