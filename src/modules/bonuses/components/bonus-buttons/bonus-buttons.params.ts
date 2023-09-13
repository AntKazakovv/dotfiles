import {
    CustomType,
    IIndexing,
    IComponentWithPendingBtns,
} from 'wlc-engine/modules/core';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type TClickHandler = (...args: unknown[]) => Promise<void> | void;

export interface ILinkParams {
    state: string;
    params?: IIndexing<string>;
}

export interface IBonusButtonsCParams extends IComponentWithPendingBtns<Theme, Type, ThemeMod> {
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
    btnsParams: {
        subscribeBtnParams: {
            common: {
                text: gettext('Subscribe'),
                typeAttr: 'button',
            },
            wlcElement: 'button_subscribe',
        },
        unsubscribeBtnParams: {
            themeMod: 'secondary',
            common: {
                text: gettext('Unsubscribe'),
                typeAttr: 'button',
            },
            wlcElement: 'button_unsubscribe',
        },
        cancelBtnParams: {
            themeMod: 'secondary',
            common: {
                text: gettext('Cancel'),
                typeAttr: 'button',
            },
            wlcElement: 'button_cancel',
        },
        inventoriedBtnParams: {
            common: {
                text: gettext('Take'),
                typeAttr: 'button',
            },
        },
        closeBtnParams: {
            themeMod: 'secondary',
            common: {
                text: gettext('Close'),
                typeAttr: 'button',
            },
        },
        chooseBtnParams: {
            common: {
                text: gettext('Choose'),
                typeAttr: 'button',
            },
        },
        depBtnParams: {
            common: {
                text: gettext('Deposit'),
                typeAttr: 'button',
            },
        },
        playBtnParams: {
            common: {
                text: gettext('Play'),
                typeAttr: 'button',
            },
        },
        readMoreBtnParams: {
            themeMod: 'secondary',
            common: {
                text: gettext('Read more'),
                typeAttr: 'button',
            },
        },
        regBtnParams: {
            common: {
                text: gettext('Sign up'),
                typeAttr: 'button',
            },
        },
        openLootboxBtnParams: {
            common: {
                text: gettext('Open'),
                typeAttr: 'button',
            },
        },
    },
};
