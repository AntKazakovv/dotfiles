import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

/**
 * Achievement title type
 * 'default' - text for title will be used from component params
 * 'state' - text for title will be used from state params.
 *                      If category not found, text for title will be used from common group
 */
export type ComponentType = 'default' | 'state' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IQuestsTitleCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /** Text for title */
    text?: string;
}

export const defaultParams: IQuestsTitleCParams = {
    moduleName: 'quests',
    componentName: 'wlc-quests-title',
    class: 'wlc-quests-title',
    text: gettext('Quests'),
};
