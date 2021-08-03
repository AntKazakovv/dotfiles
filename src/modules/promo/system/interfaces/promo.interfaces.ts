import {IWinnersParams} from '../services';

export interface IPromoConfig {
    winners?: {
        latestWins?: IWinnersParams;
        biggestWins?: IWinnersParams;
    };
};
