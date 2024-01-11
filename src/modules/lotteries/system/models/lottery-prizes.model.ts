import _map from 'lodash-es/map';
import _keys from 'lodash-es/keys';
import _set from 'lodash-es/set';
import _slice from 'lodash-es/slice';
import _indexOf from 'lodash-es/indexOf';
import _forEach from 'lodash-es/forEach';

import {
    ILotteryPrize,
    TLotteryBonusPrize,
    TLotteryPrizeType,
    TLotteryWinningSpread,
    TRawLotteryBonusPrize,
} from 'wlc-engine/modules/lotteries/system/interfaces/lotteries.interface';
import {CurrenciesInfo} from 'wlc-engine/modules/core/constants';

export class LotteryPrizes {
    public prizeTable: ILotteryPrize[] = [];
    public totalRows: number;

    private data: TLotteryWinningSpread[];
    private userCurrency: string;

    constructor(data: TLotteryWinningSpread[], currency?: string) {
        this.data = data;
        this.userCurrency = currency;

        this.init();
    }

    public getPrizes(limit?: number): ILotteryPrize[] {

        if (limit) {
            return _slice(this.prizeTable, 0, limit);
        } else {
            return this.prizeTable;
        }
    }

    private init(): void {
        const goodsKey: string = 'GOODS';

        this.prizeTable = _map(this.data, (row: TLotteryWinningSpread, i: number): ILotteryPrize => {
            const place: number = i + 1;
            const type: TLotteryPrizeType = (_indexOf(_keys(row), goodsKey) >= 0) ? 'goods' : 'bonus';
            let value: TLotteryBonusPrize[] | string;

            const dataRow: ILotteryPrize = {place, type, value};

            if (type === 'goods') {
                value = row[goodsKey];
            } else {
                value = this.transformPrizes(row);
            }
            _set(dataRow, 'value', value);

            return dataRow;
        });

        this.totalRows = this.prizeTable.length;
    }

    private transformPrizes(data: TRawLotteryBonusPrize): TLotteryBonusPrize[] {
        const transformed: TLotteryBonusPrize[] = [];
        const moneyCurrency = this.userCurrency?.toUpperCase() || 'EUR';

        if (data[moneyCurrency]) {
            transformed.push({currency: moneyCurrency, value: data[moneyCurrency]});
        }

        _forEach(Array.from(CurrenciesInfo.specialCurrencies), (currency: string): void => {
            const value: string = data[currency];
            if (value) {
                transformed.push({currency, value});
            }
        });

        return transformed;
    }
}
