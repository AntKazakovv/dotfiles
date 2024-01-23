import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IWrapperCParams} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILoyaltyLevelWpParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    hideDescription?: boolean,
    loyaltyDescriptionPost?: IWrapperCParams,
    hideInfo?: boolean,
    loyaltyInfoPost?: IWrapperCParams,
}

export const defaultParams: ILoyaltyLevelWpParams = {
    moduleName: 'loyalty',
    class: 'wlc-loyalty-levels-wp',
    componentName: 'wlc-loyalty-levels-wp',
    hideDescription: false,
    hideInfo: false,
    loyaltyDescriptionPost: {
        components: [
            {
                name: 'static.wlc-post',
                params: {
                    slug: 'loyalty-description',
                },
            },
        ],
    },
    loyaltyInfoPost: {
        components: [
            {
                name: 'static.wlc-post',
                params: {
                    slug: 'loyalty-info',
                },
            },
        ],
    },
};
