import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IProgressBarCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    prefixText?: string;
}

export const defaultParams: IProgressBarCParams = {
    class: 'wlc-progress-bar',
    componentName: 'wlc-progress-bar',
    moduleName: 'games',
    prefixText: gettext('You viewed'),
};
