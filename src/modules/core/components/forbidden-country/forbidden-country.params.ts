import {IComponentParams} from 'wlc-engine/modules/core';

export interface IForbiddenCountryParams extends IComponentParams<string, string, string> {
    countryName: string,
    casinoName: string,
    supportEmail: string,
}

export const defaultParams: IForbiddenCountryParams = {
    class: 'wlc-forbidden-country',
    casinoName: '',
    countryName: '',
    supportEmail: '',
};
