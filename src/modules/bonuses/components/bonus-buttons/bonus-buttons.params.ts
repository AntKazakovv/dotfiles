import {
    IComponentParams,
    CustomType,
    IIndexing,
} from 'wlc-engine/modules/core';
import {IBonusType} from 'wlc-engine/modules/bonuses';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ILinkParams {
    state: string;
    params?: IIndexing<string>;
}

export interface IBonusButtonsCParams extends IComponentParams<Theme, Type, ThemeMod> {
    /** Bonus type */
    bonusType?: IBonusType;
    /** Use action buttons */
    useActionButtons?: boolean;
    /** Promo links settings*/
    promoLinks?: {
        /** Deposit settings */
        deposit?: ILinkParams;
        /** Play settings*/
        play?: ILinkParams;
    };
}

export const defaultParams: IBonusButtonsCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonus-buttons',
    class: 'wlc-bonus-buttons',
    useActionButtons: true,
    promoLinks: {
        deposit: {
            state: 'app.profile.cash.deposit',
        },
        play: {
            state: 'app.catalog',
            params: {
                category: 'casino',
            },
        },
    },
};
