import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IBetInfoCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    betInfoTitle?: string,
    betInfo?: {
        currency?: string,
        amount?: string,
        isWin?: boolean,
        coefficient?: string,
        profit?: string,
    }
}


export const defaultParams: IBetInfoCParams = {
    moduleName: 'user',
    componentName: 'wlc-bet-info',
    class: 'wlc-bet-info',
};
