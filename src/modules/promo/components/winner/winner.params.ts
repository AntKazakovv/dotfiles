import {WinnerModel} from 'wlc-engine/modules/promo/system/models/winner.model';
import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export type WinnerType = 'default' | CustomType;
export type WinnerTheme = 'default' | 'vertical' | CustomType;

export interface IWinnerCParams extends IComponentParams<WinnerTheme, WinnerType, string> {
    winner?: WinnerModel;
    hideCountry?: boolean;
    hideGameIcon?: boolean;
};

export const defaultParams: Partial<IWinnerCParams> = {
    class: 'wlc-winner',
};
