import {
    CustomType,
    IComponentParams,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import * as componentLib from 'wlc-engine/modules/core/system/config/layouts/components';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IIconExpLpDescriptionCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    enableUserStats?: boolean,
    userStatsConfig?: IWrapperCParams,
}

export const defaultParams: IIconExpLpDescriptionCParams = {
    class: 'wlc-icon-exp-lp',
    moduleName: 'user',
    componentName: 'wlc-icon-exp-lp',
    enableUserStats: false,
    userStatsConfig: {
        components: [
            componentLib.wlcUserStats.wolfDescription,
        ],
    },
};
