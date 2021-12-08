import {JackpotsSliderNoContentByThemeType} from '../../components/jackpots-slider/jackpots-slider.params';
import {WinnersSliderNoContentByThemeType} from '../../components/winners-slider/winners-slider.params';
import {IWinnersParams} from '../services';

export interface IPromoConfig {
    winners?: {
        latestWins?: IWinnersParams;
        biggestWins?: IWinnersParams;
    };
    loyalty?: {
        /**
         * Change loyalty-program & loyalty-info title
         */
        programTitle?: string;
    },
    components?: {
        'wlc-winners-slider'?: {
            noContent: WinnersSliderNoContentByThemeType,
        },
        'wlc-jackpots-slider'?: {
            noContent: JackpotsSliderNoContentByThemeType,
        },
    },
};
