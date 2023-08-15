import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;

export interface IScrollbarCParams extends IComponentParams<ComponentTheme, string, string> {
};

export const defaultParams: IScrollbarCParams = {
    moduleName: 'core',
    componentName: 'wlc-scrollbar',
    class: 'wlc-scrollbar',
};
