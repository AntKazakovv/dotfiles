import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ILoyaltyProgramCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    imagePath?: string;
    imageType?: string;
    decorLeftPath?: string;
    decorRightPath?: string;
    decorImageType?: string;
    levelsLimit?: number;
};

export const defaultParams: ILoyaltyProgramCParams = {
    moduleName: 'promo',
    componentName: 'wlc-loyalty-program',
    class: 'wlc-loyalty-program',
    imagePath: '/gstatic/loyalty-program/',
    imageType: 'png',
    decorLeftPath: '/gstatic/loyalty-program/decor/left-decor.png',
    decorRightPath: '/gstatic/loyalty-program/decor/right-decor.png',
    levelsLimit: 4,
};
