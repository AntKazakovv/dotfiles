import {
    CustomType,
    GlobalHelper,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ICashbackTimerCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    titleText?: string;
    calculatingText?: string;
    timerText?: string;
    decorImagePath?: string;
}

export const defaultParams: ICashbackTimerCParams = {
    moduleName: 'cashback',
    componentName: 'wlc-cashback-timer',
    theme: 'default',
    class: 'wlc-cashback-timer',
    titleText: gettext('Cashback'),
    calculatingText: gettext('We are already calculating your cashback!'),
    timerText: gettext('Available in'),
    decorImagePath: GlobalHelper.gstaticUrl + '/wlc/cashback/cashback-decor.png',
};
