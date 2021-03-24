import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ITextBlockCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {
        textBlockTitle?: string | string[],
        textBlockSubtitle?: string | string[],
        textBlockText?: string | string[],
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
