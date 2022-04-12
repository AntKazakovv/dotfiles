import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export type ComponentTheme = string;
export type ComponentType = string;
export type ComponentThemeMod = string;

export interface IRatingCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    starsCount?: number;
    mock?: {
        use?: boolean;
        from?: number;
        to?: number;
    }
};

export const defaultParams: IRatingCParams = {
    class: 'wlc-rating',
    moduleName: 'core',
    componentName: 'wlc-rating',
    theme: 'default',
    starsCount: 5,
};
