import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ILoyaltyProgressCParams} from 'wlc-engine/modules/user';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ILoyaltyBlockCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    loyaltyProgressParams?: ILoyaltyProgressCParams;
}

export const defaultParams: ILoyaltyBlockCParams = {
    moduleName: 'user',
    componentName: 'wlc-loyalty-block',
    class: 'wlc-loyalty-block',
    loyaltyProgressParams: {
        common: {
            showLevelIcon: false,
            showLinkToLevels: true,
        },
    },
};
