import {IButtonCParams} from 'wlc-engine/modules/core';
import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ILoyaltyProgressCParams} from 'wlc-engine/modules/user';

export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ILoyaltyBlockCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    loyaltyProgressParams?: ILoyaltyProgressCParams;
    buttonParams?: IButtonCParams;
    isGameDashboard?: boolean;
}

export const defaultParams: ILoyaltyBlockCParams = {
    moduleName: 'user',
    componentName: 'wlc-loyalty-block',
    class: 'wlc-loyalty-block',
    loyaltyProgressParams: {
        common: {
            showLevelIcon: false,
        },
    },
    buttonParams: {
        wlcElement: 'progress-all-levels-button',
        theme: 'cleared',
        common: {
            text: gettext('All levels'),
            typeAttr: 'button',
            sref: 'app.profile.loyalty-level',
            iconPath: '/wlc/icons/arrow.svg',
        },
    },
    isGameDashboard: false,
};
