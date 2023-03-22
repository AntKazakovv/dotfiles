import {
    IComponentParams,
    CustomType,
    IInputCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IEmailFieldCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    email: IInputCParams,
};

export const defaultParams: IEmailFieldCParams = {
    class: 'wlc-email-field',
    componentName: 'wlc-email-field',
    moduleName: 'user',
    email: {
        common: {
            placeholder: gettext('E-mail'),
        },
        wlcElement: 'block_email',
        name: 'email',
        validators: ['required', 'email'],
        exampleValue: 'example@mail.com',
    },
};
