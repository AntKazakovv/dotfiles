import {
    IComponentParams,
    CustomType,
    IIndexing,
    IModalParams,
} from 'wlc-engine/modules/core';
import {
    TargetStateDef,
} from '@uirouter/core';

export type Type = CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IActionButton {
    /** Button icon */
    icon: string;
    /** Modal name for show */
    showModal?: IModalParams;
    /** State info for open */
    openState?: TargetStateDef;
}

export interface IBackButton {
    /** Use or not back button for navigate to prev state */
    use: boolean;
}

export interface IMobileHeaderParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    /** Hide component on some states */
    hideForStates?: string[];
    /** Back button settings */
    backButton?: IBackButton;
    /** Action button setting by state */
    /**
     * Example:
     *
     * {
     *         'app.home': {
     *             icon: '/wlc/icons/tournaments.svg',
     *             openState: {
     *                 state: 'app.tournaments',
     *                 params: {},
     *                 options: {},
     *             }
     *         },
     *         'app.profile.main.info': {
     *             icon: '/wlc/icons/settings.svg',
     *             showModal: 'settings',
     *         },
     *     }
     */
    actionButtonByState?: IIndexing<IActionButton>;
}

export const defaultParams: IMobileHeaderParams = {
    moduleName: 'menu',
    componentName: 'wlc-mobile-header',
    class: 'wlc-mobile-header',
    backButton: {
        use: true,
    },
};
