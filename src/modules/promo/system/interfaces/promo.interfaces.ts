import {JackpotsSliderNoContentByThemeType} from '../../components/jackpots-slider/jackpots-slider.params';
import {WinnersSliderNoContentByThemeType} from '../../components/winners-slider/winners-slider.params';
import {IWinnersParams} from '../services';

export interface IPromoConfig {
    winners?: {
        latestWins?: IWinnersParams;
        biggestWins?: IWinnersParams;
    };
    components?: {
        'wlc-winners-slider'?: {
            noContent: WinnersSliderNoContentByThemeType,
        },
        'wlc-jackpots-slider'?: {
            noContent: JackpotsSliderNoContentByThemeType,
        },
    },
};
