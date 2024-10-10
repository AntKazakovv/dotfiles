import {
    CustomType,
    IComponentParams,
    ILayoutComponent,
    IWrapperCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILoyaltyData {
    level: number,
    levelName: string,
    points: number,
    nextLevelPoints: number,
    loyaltyCheckDate: string,
}

export interface ILevelViewData {
    level?: number;
    levelName?: string;
    levelIcon?: string;
    levelIconFallback?: string;
    userPoints?: number;
    nextLevel?: string;
    nextLevelName?: string;
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
        expiryDateText?: string;
        showExpiryDate?: boolean;
    };
}

export const defaultParams: ILoyaltyProgressCParams = {
    moduleName: 'user',
    componentName: 'wlc-loyalty-progress',
    class: 'wlc-loyalty-progress',
    common: {
        maxProgressText: gettext('Max'),
        showLevelIcon: true,
        levelIconComponent: {
            name: 'loyalty.wlc-loyalty-level',
            params: {
                theme: 'wolf',
                themeMod: 'compact',
                isUserLevel: true,
            },
        },
        expiryDateText: gettext('Your experience points expire:'),
        showExpiryDate: false,
    },
};
