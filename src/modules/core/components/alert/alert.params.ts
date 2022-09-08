import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;


export const alertIcons: IIndexing<string> = {
    info: 'wlc/icons/info.svg',
    warning: 'wlc/icons/warning.svg',
    default: 'wlc/icons/info.svg',
};

export type TLevel = keyof typeof alertIcons;

export interface IAlertCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    title?: string;
    text?: string;
    level?: TLevel;
};

export const defaultParams: IAlertCParams = {
    class: 'wlc-alert',
    componentName: 'wlc-alert',
    moduleName: 'core',
    level: 'default',
};
