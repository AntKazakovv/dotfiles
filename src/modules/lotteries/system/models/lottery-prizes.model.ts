import _map from 'lodash-es/map';
import _slice from 'lodash-es/slice';
import _isArray from 'lodash-es/isArray';

import {
    ILotteryPrizeRow,
    TLotteryWinningSpread,
} from 'wlc-engine/modules/lotteries/system/interfaces/lotteries.interface';
import {LotteriesHelper} from '../helpers/lotteries.helper';
import {IIndexing} from 'wlc-engine/modules/core';

export class LotteryPrizes {
    public prizeTable: ILotteryPrizeRow[] = [];
    public totalRows: number;

    private data: IIndexing<TLotteryWinningSpread>;

    constructor(data: IIndexing<TLotteryWinningSpread>) {
        this.data = data;
        this.init();
    }

    public getPrizes(limit?: number): ILotteryPrizeRow[] {

        if (limit) {
            return _slice(this.prizeTable, 0, limit);
        } else {
            return this.prizeTable;
        }
    }

    private init(): void {
        // TODO: temporal logic until WinningSpread is fixed on back
        // loyalty ticket: https://tracker.egamings.com/issues/589698
        const isArray = _isArray(this.data);
        this.prizeTable = _map(this.data, (row: TLotteryWinningSpread, index: string): ILotteryPrizeRow => {
            let place = Number(index);

            if (isArray) {
                place++;
            }

            return {
                place,
                prize: LotteriesHelper.getPrize(row),
            };
        });

        this.totalRows = this.prizeTable.length;
    }
}
