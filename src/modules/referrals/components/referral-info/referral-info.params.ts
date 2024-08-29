import {IButtonCParams, IModalParams} from 'wlc-engine/modules/core';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IReferralInfoCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /** URL for decor picture in Earn more block */
    decorUrl?: string;
    /** Fallback URL for decor picture in Earn more block */
    decorFallbackUrl?: string;
    /** Params for button 'Get commission' */
    getCommissionBtn?: IButtonCParams;
    confirmModalParams?: IModalParams;
};

export interface IReferralInfoTranslations {
    casinoName: string;
}

export const defaultParams: IReferralInfoCParams = {
    class: 'wlc-referral-info',
    componentName: 'wlc-referral-info',
    moduleName: 'referrals',
    getCommissionBtn: {
        wlcElement: 'btn_referrals_get_commission',
        common: {
            text: gettext('Get commission'),
        },
    },
    decorUrl: '//agstatic.com/referral/decor.png',
    decorFallbackUrl: '//agstatic.com/referral/decor.png',
    confirmModalParams: {
        id: 'referral-commission-confirm',
        modifier: 'confirmation',
        showConfirmBtn: true,
        textAlign: 'center',
        modalTitle: gettext('Confirmation'),
        modalMessage: gettext('Are you sure?'),
        confirmBtnText: gettext('Yes'),
        closeBtnText: gettext('No'),
    },
};
