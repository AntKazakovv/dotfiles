import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export type Theme = 'default' | 'circle' | 'dot' | CustomType;
export type Type =  'bonuses-main' | 'bonuses-all' | 'store' | 'tournaments' | 'internal-mails' | CustomType;
export type ThemeMod = 'default' | 'internal-mails' | CustomType;

export interface ICounterCParams extends IComponentParams<Theme, Type, ThemeMod> {
    /*
    * Hide counter if value = 0
     */
    hideIfZero?: boolean;
}

export const defaultParams: ICounterCParams = {
    class: 'wlc-counter',
};
