import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import _map from 'lodash-es/map';

import {
    ILottery,
    ILotteryBase,
    ILotteryResults,
} from 'wlc-engine/modules/lotteries/system/interfaces/lotteries.interface';
import {LotteryResult} from 'wlc-engine/modules/lotteries/system/models/lottery-result.model';

export class BaseLottery {
    public readonly id: number;
    public readonly name: string;
    public readonly dateFormat: string = 'DD.MM.YYYY HH:mm';
    public readonly dateFormatShort: string = 'DD.MM.YYYY';

    protected data: ILotteryBase;

    private _results: LotteryResult[] = [];

    constructor(data: ILotteryBase | ILottery) {
        this.data = data;
        this.id = this.data.ID;
        this.name = this.data.Name;

        this.data.Results.sort((a: ILotteryResults, b: ILotteryResults): number => Number(a.Place) - Number(b.Place));
        this.prepareResults();
    }

    public get drawingDate(): Dayjs {
        const defaultTime: Dayjs = dayjs(this.data.DrawingDate, 'YYYY-MM-DD HH:mm:ss');
        return defaultTime.add(dayjs().utcOffset(), 'minute');
    }

    public get drawingDateFormatted(): string {
        return this.drawingDate.format(this.dateFormat);
    }

    public get drawingDateFormattedShot(): string {
        return this.drawingDate.format(this.dateFormatShort);
    }

    public get results(): LotteryResult[] {
        return this._results;
    }

    public updateResults(id?: number): void {
        LotteryResult.userId = id;
        this.prepareResults();
    }

    private prepareResults(): void {
        this._results = _map(this.data.Results, (row: ILotteryResults): LotteryResult => {
            return new LotteryResult(row);
        });
    }
}
