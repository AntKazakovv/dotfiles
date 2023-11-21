import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

/**
 * Achievement title type
 * 'default' - text for title will be used from component params
 * 'achievement-category' - text for title will be used from state params.
 *                      If category not found, text for title will be used from common group
 */
export type ComponentType = 'default' | 'achievement-group' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;
export type AutoModifiers = ComponentTheme | ComponentThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IAchievementTitleCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ComponentThemeMod;
        customModifiers?: CustomMod;
        /** Text for title */
        text?: string;
    };
}

export const defaultParams: IAchievementTitleCParams = {
    moduleName: 'achievements',
    componentName: 'wlc-achievement-title',
    class: 'wlc-achievement-title',
    common: {
        text: gettext('Achievements'),
    },
};
