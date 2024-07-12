import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    AchievementModel,
} from 'wlc-engine/modules/loyalty/submodules/achievements/system/models/achievement.model';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILevelData {
    name: string,
    description: string,
    isCompleted: boolean,
    isCurrent: boolean,
}

export interface IAchievementLevelsCParams
    extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    achievement?: AchievementModel,
    currentLevelTagText?: string,
    levelNameGenerateFn?: (name: string, level: number) => string,
}

export const defaultParams: IAchievementLevelsCParams = {
    moduleName: 'achievements',
    componentName: 'wlc-achievement-levels',
    class: 'wlc-achievement-levels',
    currentLevelTagText: gettext('Current level'),
    levelNameGenerateFn: (name: string, level: number): string => `lvl ${level + 1}: ${name}`,
};
