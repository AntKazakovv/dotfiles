import {DateTime} from 'luxon';
import _indexOf from 'lodash-es/indexOf';

import {
    ILottery,
    TLotteryStatus,
} from 'wlc-engine/modules/lotteries/system/interfaces/lotteries.interface';
import {LotteryPrizes} from 'wlc-engine/modules/lotteries/system/models/lottery-prizes.model';
import {BaseLottery} from 'wlc-engine/modules/lotteries/system/models/base-lottery.model';

export class Lottery extends BaseLottery {
    public static userLevel: number;
    public static userCurrency: string;
    public static ticketsCount: number = 0;
    public readonly levels: Array<string | number>;
    public readonly levelsString: string;
    public readonly isForAllLevels: boolean;
    public prizes: LotteryPrizes;

    protected override data: ILottery;

    private static _userCurrency: string;

    constructor(data: ILottery) {
        super(data);
        this.levels = this.data.Levels.sort((a, b) => Number(a) - Number(b));
        this.levelsString = this.levels.join(', ');
        this.isForAllLevels = _indexOf(this.levels, 'all') >= 0;

        this.init();
    }

    public get ticketsCount(): number {
        return this.data.UserTicketsCount || 0;
    }

    public get description(): string {
        return this.data.Description || '';
    }

    public get terms(): string {
        return this.data.Terms || '';
    }

    public get alias(): string {
        return this.data.Alias;
    }

    public get price(): number {
        return this.data.Price;
    }

    public get currency(): string {
        return Lottery.userCurrency || 'EUR';
    }

    public get checkUserLevel(): boolean {
        if (this.isForAllLevels) {
            return true;
        }
        return _indexOf(this.levels, Number(Lottery.userLevel)) >= 0;
    }

    /** Дата старта эмиссии билетов */
    public get dateStart(): DateTime {
        const defaultTime = DateTime.fromSQL(this.data.DateStart);
        return defaultTime.plus({minutes: defaultTime.offset});
    }

    public get dateStartFormatted(): string {
        return this.dateStart.toFormat(this.dateFormat);
    }

    /** Дата конца эмиссии билетов */
    public get dateEnd(): DateTime {
        const defaultTime = DateTime.fromSQL(this.data.DateEnd);
        return defaultTime.plus({minutes: defaultTime.offset});
    }

    public get dateEndFormatted(): string {
        return this.dateEnd.toFormat(this.dateFormat);
    }

    public get datesFormatted(): string {
        return `${this.dateStartFormatted} - ${this.drawingDateFormatted}`;
    }

    public get imageMain(): string {
        return this.data.Images.main;
    }

    public get imageDescription(): string {
        return this.data.Images.description || this.data.Images.main;
    }

    /** Ожидается старт эмиссии билетов */
    public get isWaitingForStart(): boolean {
        return this.dateStart.toMillis() - DateTime.local().toMillis() > 0;
    }

    public get isTicketSaleStopped(): boolean {
        return this.dateEnd.toMillis() - DateTime.local().toMillis() < 0;
    }

    public get isActive(): boolean {
        return this.data.Status === 1 && !this.isTicketSaleStopped;
    }

    public get isEnded(): boolean {
        return this.drawingDate.toMillis() - DateTime.local().toMillis() < 0;
    }

    public get isWaitingForResults(): boolean {
        return this.isEnded && !this.results.length;
    }

    public get status(): TLotteryStatus {
        let status: TLotteryStatus;
        if (this.data.Status === 1) {
            if (!this.isTicketSaleStopped) {
                status = 'active';
            } else if (this.isWaitingForResults) {
                status = 'ending';
            }
        } else if (this.data.Status === 100) {
            if (this.isTicketSaleStopped) {
                status = 'ended';
            }
            if (this.isWaitingForStart) {
                status = 'notStarted';
            }
        }

        return status;
    }

    public calcTicketsCount(amount: number): number {
        const count = Math.trunc(amount / this.price);
        Lottery.ticketsCount = count;
        return count;
    }

    private init(): void {
        this.preparePrizes();
    }

    private preparePrizes(): void {
        this.prizes = new LotteryPrizes(this.data.WinningSpread);
    }
}
