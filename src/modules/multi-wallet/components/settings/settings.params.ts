import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ISettingsParams extends IComponentParams<Theme, Type, ThemeMod> {
    viewFiatText?: string;
    descriptionText?: string;
    infoBlockText?: string;
}

export const defaultParams: ISettingsParams = {
    class: 'wlc-settings',
    moduleName: 'multi-wallet',
    componentName: 'wlc-settings',
    viewFiatText: gettext('View in fiat'),
    descriptionText: gettext('Select the fiat currency to display your bets'),
    infoBlockText: gettext('Please note that the currency amounts are approximate'),
};
