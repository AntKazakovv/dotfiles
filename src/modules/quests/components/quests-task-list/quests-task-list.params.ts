import {
    CustomType,
    IComponentParams,
    IWrapperCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IQuestsTaskListCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    emptyConfig?: IWrapperCParams;
}

export const defaultParams: IQuestsTaskListCParams = {
    moduleName: 'quests',
    componentName: 'wlc-quests-task-list',
    class: 'wlc-quests-task-list',
    emptyConfig: {
        components: [
            {
                name: 'profile.wlc-profile-no-content',
                params: {
                    text: gettext('No quests available'),
                },
            },
        ],
    },
};
