import {IWinnersParams} from 'wlc-engine/modules/promo/services';

export interface IBaseModuleParams {
    customLogoName?: string;
    statistic?: IBaseModuleStatisticParams;
}

export interface IBaseModuleStatisticParams {
    latestWins?: IWinnersParams;
    biggestWins?: IWinnersParams;
};
