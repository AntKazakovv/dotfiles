import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IHaveAccountCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {
        titleText?: string,
        linkText?: string,
        modalName?: string,
    };
}

export const defaultParams: IHaveAccountCParams = {
    moduleName: 'user',
    componentName: 'wlc-have-account',
    class: 'wlc-have-account',
    common: {
        titleText: gettext('Don’t have an account?'),
        linkText: gettext('Register now'),
        modalName: 'signup',
    },
};
