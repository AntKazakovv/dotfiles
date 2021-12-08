import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ILoyaltyProgramCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    title?: string;
    imagePath?: string;
    imageType?: string;
    decorLeftPath?: string;
    decorRightPath?: string;
    decorImageType?: string;
    levelsLimit?: number;
    /**
     * this text will be shown on empty state(when there is no content)
     */
    emptyStateText?: string;
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
    /**
     * this text will be shown on empty state(when there is no content)
     */
    emptyStateText: gettext('An error occurred while loading data. Please try again later.'),
};
