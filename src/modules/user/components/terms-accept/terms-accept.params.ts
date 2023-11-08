import {UntypedFormControl} from '@angular/forms';

import {
    CustomType,
    FormElements,
    IButtonCParams,
    ICheckboxCParams,
    IComponentParams,
    IFormComponent,
    IFormWrapperCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'extended' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ITermsAcceptCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    requiredCheckbox?: string[];
}

export const defaultParams: ITermsAcceptCParams = {
    moduleName: 'user',
    componentName: 'wlc-accept-terms',
    class: 'wlc-accept-terms',
};

export const submitButton = [
    {
        name: 'core.wlc-button',
        params: <IButtonCParams>{
            name: 'submit',
            common: {
                wlcElement: 'button_submit',
                typeAttr: 'submit',
                text: gettext('Submit'),
            },
        },
    },
];
export const defaultConfig = [
    {
        name: 'core.wlc-checkbox',
        params: <ICheckboxCParams>{
            name: 'agreedWithTermsAndConditions',
            checkboxType: 'legal-modal',
            textWithLink: {
                prefix: gettext('I agree with'),
                linkText: gettext('Terms and Conditions'),
                slug: 'terms-and-conditions',
            },
            control: new UntypedFormControl(),
            wlcElement: 'block_terms-checkbox',
            common: {
                customModifiers: 'terms',
            },
            validators: ['requiredTrue'],
        },
    },
    ...submitButton,
];

export const generateExtendedConfig = (requiredCheckbox: string[]): IFormComponent[] => {
    return [
        requiredCheckbox.includes('agreedWithTermsAndConditions') ? FormElements.terms : null,
        requiredCheckbox.includes('agreeWithSelfExcluded') ? {
            name: 'core.wlc-checkbox',
            params: {
                name: 'agreeWithSelfExcluded',
                text: gettext('I have not self-excluded from any gambling website in the past 12 months'),
                wlcElement: 'block_self_excluded',
                common: {
                    customModifiers: 'self-exclude',
                },
                validators: ['requiredTrue'],
            },
        } : null,
        requiredCheckbox.includes('ageConfirmed') ? FormElements.age : null,
        ...submitButton,
    ];
};

export const termsAcceptFormConfig = (requiredCheckbox: string[]): IFormWrapperCParams => {
    return {
        class: 'wlc-form-wrapper',
        components: requiredCheckbox?.length ? generateExtendedConfig(requiredCheckbox) : defaultConfig,
    };
};
