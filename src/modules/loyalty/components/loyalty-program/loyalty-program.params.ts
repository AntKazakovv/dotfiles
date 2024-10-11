import {
    CustomType,
    GlobalHelper,
    IButtonCParams,
    IComponentParams,
    ISliderCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILoyaltyProgramCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    title?: string;
    decorLeftPath?: string;
    decorRightPath?: string;
    /**
     * crop levels to this value. Not working for wolf theme.
     */
    levelsLimit?: number;
    /**
     * this text will be shown on empty state(when there is no content)
     */
    emptyStateText?: string;
    /**
     * Options overriding slider behavior
     */
    sliderParams?: ISliderCParams;
    useNavigation?: boolean;
    btnParams?: IButtonCParams;
}

export const defaultParams: ILoyaltyProgramCParams = {
    moduleName: 'loyalty',
    componentName: 'wlc-loyalty-program',
    class: 'wlc-loyalty-program',
    levelsLimit: 4,
    decorLeftPath: GlobalHelper.gstaticUrl + '/loyalty-program/decor/left-decor.png',
    decorRightPath: GlobalHelper.gstaticUrl + '/loyalty-program/decor/right-decor.png',
    emptyStateText: gettext(' An error has occurred while loading the data. Please try again later'),
};
