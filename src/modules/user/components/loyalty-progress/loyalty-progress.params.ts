import {
    CustomType,
    IButtonCParams,
    IComponentParams,
    ILayoutComponent,
    IWrapperCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILoyaltyData {
    level: number,
    levelName: string,
    points: number,
    nextLevelPoints: number
}

export interface ILevelViewData {
    levelName?: string;
    levelIcon?: string;
    levelIconFallback?: string;
    userPoints?: number;
    nextLevelPoints?: number;
    percentProgress?: number;
    wrapperParams?: IWrapperCParams;
}

export interface ILoyaltyProgressCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    common?: {
        maxProgressText?: string;
        showLevelIcon?: boolean;
        /**
         * Be used only if showLevelIcon === true
         * **/
        levelIconComponent?: ILayoutComponent;
        showLinkToLevels?: boolean;
        buttonParams?: IButtonCParams;
    };
}

export const defaultParams: ILoyaltyProgressCParams = {
    moduleName: 'user',
    componentName: 'wlc-loyalty-progress',
    class: 'wlc-loyalty-progress',
    common: {
        maxProgressText: gettext('Max'),
        showLevelIcon: true,
        showLinkToLevels: false,
        levelIconComponent: {
            name: 'loyalty.wlc-loyalty-level',
            params: {
                theme: 'wolf',
                themeMod: 'compact',
                isUserLevel: true,
            },
        },
        buttonParams: {
            wlcElement: 'progress-all-levels-button',
            theme: 'cleared',
            common: {
                text: gettext('All levels'),
                typeAttr: 'button',
                sref: 'app.profile.loyalty-level',
            },
        },
    },
};
