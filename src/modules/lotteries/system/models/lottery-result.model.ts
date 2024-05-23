import _reduce from 'lodash-es/reduce';

import {
    ILotteryPrize,
    ILotteryResultRow,
    ILotteryResults,
    IRawLotteryWinner,
} from 'wlc-engine/modules/lotteries/system/interfaces/lotteries.interface';
import {LotteriesHelper} from 'wlc-engine/modules/lotteries/system/helpers/lotteries.helper';

export class LotteryResult {
    public place: number;
    public prize: ILotteryPrize;
    public rows: ILotteryResultRow[] = [];
    public extraUsers: number = 0;
    public isCurrent: boolean = false;

    private static _userId: number;
    private data: ILotteryResults;

    constructor(
        data: ILotteryResults,
    ) {
        this.data = data;
        this.place = this.data.Place;
        this.prize = LotteriesHelper.getPrize(this.data.Prize);

        const usersLength = this.data.Users.length;
        if (usersLength < this.data.TotalUsers) {
            this.extraUsers = this.data.TotalUsers - usersLength;
        }

        this.prepareRows();
    }

    public static get userId(): number {
        return LotteryResult._userId;
    }

    public static set userId(id: number | null) {
        LotteryResult._userId = id;
    }

    private prepareRows(): void {
        this.rows = _reduce(
            this.data.Users,
            (acc: ILotteryResultRow[], item: IRawLotteryWinner) => {
                this.isCurrent = LotteryResult.userId && LotteryResult.userId === item.ID;
                const user: string = this.isCurrent ? gettext('You') : item.Name;
                const row: ILotteryResultRow = {
                    user,
                    isCurrent: this.isCurrent,
                };

                if (this.isCurrent) {
                    acc.unshift(row);
                } else {
                    acc.push(row);
                }

                return acc;
            }, []);
    }
}
