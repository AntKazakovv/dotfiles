import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ITextBlockCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {
        textBlockTitle?: string,
        textBlockSubtitle?: string | string[],
        textBlockText?: string,
        dynamicText?: {
            text?: string,
            textDefault?: string,
            param?: string,
        },
    }
}

export const defaultParams: ITextBlockCParams = {
    moduleName: 'user',
    componentName: 'wlc-text-block',
    class: 'wlc-text-block',
    common: {},
};
