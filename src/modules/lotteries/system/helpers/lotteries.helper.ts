import _indexOf from 'lodash-es/indexOf';
import _keys from 'lodash-es/keys';
import _map from 'lodash-es/map';

import {
    ILotteryPrize,
    IBonusPrize,
    TLotteryPrizeType,
    TLotteryWinningSpread,
} from 'wlc-engine/modules/lotteries/system/interfaces/lotteries.interface';

export class LotteriesHelper {
    public static getPrize(data: TLotteryWinningSpread): ILotteryPrize {
        const goodsKey: string = 'GOODS';
        const type: TLotteryPrizeType = (_indexOf(_keys(data), goodsKey) >= 0) ? 'goods' : 'bonus';

        if (type === 'goods') {
            return {
                type,
                simpleValue: data[goodsKey],
            };
        } else {
            let bonusValue = _map(data, (value, currency): IBonusPrize => {
                return {value, currency};
            });

            return {
                type,
                bonusValue,
            };
        }
    }
}
