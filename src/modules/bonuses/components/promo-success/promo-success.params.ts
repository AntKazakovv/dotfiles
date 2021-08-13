import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IIndexing} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IPromoSuccessCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {
        title?: string,
        subtitle?: string
        iconPath?: string,
        text?: string,
        btnText?: string,
        actionParams?: IActionParams
    };
}

export interface IActionParams {
    modal?: {
        name: string,
    },
    url?: {
        path: string,
    },
    event?: {
        name: string,
    }
}

export const defaultParams: IPromoSuccessCParams = {
    moduleName: 'bonus',
    componentName: 'wlc-promo-success',
    class: 'wlc-promo-success',
    common: {
        title: gettext('Promo code'),
        iconPath: '/wlc/decors/promo-success.svg',
        text: gettext('Congratulations your promo code is activated! Bonus added to the Bonuses page and waiting for subscription'),
        btnText: gettext('Go it'),
    },
};
