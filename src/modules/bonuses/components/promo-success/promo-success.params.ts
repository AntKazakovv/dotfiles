import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export type TPromoSuccessStatus = 'selected' | 'active' | 'notSelected' | 'fromLink';

export type TPromoSeccessTexts = Record<TPromoSuccessStatus, string>;

export interface IPromoSuccessCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    /** Bonus status */
    status?: TPromoSuccessStatus;
    /** Modal title */
    title?: string;
    subtitle?: string;
    iconPath?: string;
    /** Texts by status */
    texts?: TPromoSeccessTexts,
    /** Buttons texts by status */
    btnTexts?: TPromoSeccessTexts;
    actionParams?: IActionParams;
    /** Path to redirect after closing modal */
    redirectPath?: string,
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
    moduleName: 'bonuses',
    componentName: 'wlc-promo-success',
    class: 'wlc-promo-success',
    title: gettext('Promo code'),
    iconPath: '/wlc/decors/promo-success.svg',
    texts: {
        selected: gettext('Congratulations your promo code is activated! Bonus subscribed ' +
        'and waiting for activation'),
        active: gettext('Congratulations your promo code is activated! Bonus is activated. ' +
        'You can start wagering it'),
        notSelected: gettext('Congratulations your promo code is activated! Bonus added ' +
        'to the Bonuses page and waiting for subscription'),
        fromLink: '',
    },
    btnTexts: {
        selected: gettext('OK'),
        active: gettext('OK'),
        notSelected: gettext('Got it'),
        fromLink: gettext('Got it'),
    },
    redirectPath: 'app.profile.loyalty-bonuses.main',
};
