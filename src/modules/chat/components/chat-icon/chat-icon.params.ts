import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentType = 'default' | 'wolf' | 'wolf-header' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IChatIconCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
}

export const defaultParams: IChatIconCParams = {
    moduleName: 'chat',
    class: 'wlc-chat-icon',
    componentName: 'wlc-chat-icon',
    theme: 'default',
};
