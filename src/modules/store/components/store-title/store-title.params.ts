import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

/**
 * Store title type
 * 'default' - text for title will be used from component params
 * 'store-category' - text for title will be used from state params.
 *                      If category not found, text for title will be used from component params
 */
export type Type = 'default' | 'store-category' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IStoreTitleCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        customModifiers?: CustomMod;
        /** Text for title */
        text?: string;
    };
}

export const defaultParams: IStoreTitleCParams = {
    moduleName: 'store',
    componentName: 'wlc-store-title',
    class: 'wlc-store-title',
    common: {
        text: gettext('Market'),
    },
};
