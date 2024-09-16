import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ThemeMod = 'default' | 'circle' | CustomType;

export interface IScrollUpParams extends IComponentParams<string, string, ThemeMod> {
    iconPath?: string;
    showButton: boolean;
    mobileOnly: boolean;
}

export const defaultParams: IScrollUpParams = {
    moduleName: 'core',
    componentName: 'wlc-scroll-up',
    wlcElement: 'wlc-scroll-up',
    class: 'wlc-scroll-up',
    themeMod: 'default',
    showButton: false,
    mobileOnly: false,
};
