import {
    IComponentParams,
    CustomType,
    IFormWrapperCParams,
    IIndexing,
} from 'wlc-engine/modules/core';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {TMetamaskData} from 'wlc-engine/modules/metamask/system';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IMetamaskSignUpFormCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    formConfig?: IFormWrapperCParams;
    formData?: IIndexing<unknown>;
    regData?: TMetamaskData;
    submitEventName?: string;
};

export const defaultParams: IMetamaskSignUpFormCParams = {
    class: 'wlc-metamask-sign-up-form',
    componentName: 'wlc-metamask-sign-up-form',
    moduleName: 'user',
    wlcElement: 'modal_metamask_signup',
    submitEventName: 'REGISTRATION_SUCCESS',
};
export const metamaskSignUpFormConfig: IFormWrapperCParams = {
    class: 'wlc-form-wrapper',
    components: [
        FormElements.currency,
        FormElements.terms,
        FormElements.age,
        {
            name: 'core.wlc-button',
            params: {
                common: {
                    text: gettext('Continue'),
                },
                customMod: ['submit'],
            },
        },
    ],
};
