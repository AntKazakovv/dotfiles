import {DateTime} from 'luxon';
import _indexOf from 'lodash-es/indexOf';

import {
    ILottery,
    TLotteryStatus,
    TLotteryTimerState,
} from 'wlc-engine/modules/lotteries/system/interfaces/lotteries.interface';
import {LotteryPrizes} from 'wlc-engine/modules/lotteries/system/models/lottery-prizes.model';

export class Lottery {
    public static userLevel: number;
    public static userCurrency: string;
    public readonly id: number;
    public readonly levels: Array<string | number>;
    public readonly levelsString: string;
    public readonly isForAllLevels: boolean;
    public prizes: LotteryPrizes;

    private data: ILottery;
    private dateFormat: string = 'dd.MM.yyyy HH:mm';

    constructor(
        data: ILottery,
    ) {
        this.data = data;
        this.id = this.data.ID;
        this.levels = this.data.Levels.sort((a, b) => Number(a) - Number(b));
        this.levelsString = this.levels.join(', ');
        this.isForAllLevels = _indexOf(this.levels, 'all') >= 0;

        this.init();
    }

    public get ticketsCount(): number {
        return this.data.UserTicketsCount;
    }

    public get name(): string {
        return this.data.Name;
    }

    public get description(): string {
        return this.data.Description;
    }

    public get terms(): string {
        return this.data.Terms;
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

    /** Дата розыгрыша призов
     *  Пока равна dateEnd, в дальнейшем будет отдельное поле от бэка
     */
    public get dateRaffle(): DateTime {
        return this.dateEnd;
    }

    public get datesFormatted(): string {
        return `${this.dateStartFormatted} - ${this.dateEndFormatted}`;
    }

    public get imageMain(): string {
        return this.data.Images.main;
    }

    public get imageDescription(): string {
        return this.data.Images.description || this.data.Images.main;
    }

    /** Вероятно, будет несколько фраз, в зависимости от текущего статуса лотереи */
    public getTimerText(state: TLotteryTimerState): string {
        switch (state) {
            // case 'dateStart':
            //     return gettext('The raffle starts in');
            case 'dateEnd':
                return gettext('Time until the end of ticket issuance');
            case 'raffleEnd':
            default:
                return gettext('The raffle ends in');
        }
    }

    /** Ожидается старт эмиссии билетов */
    public get isWaitingForStart(): boolean {
        return this.dateStart.toMillis() - DateTime.local().toMillis() > 0;
    }

    /** Окончена эмиссия билетов */
    public get isTicketSaleStopped(): boolean {
        return this.dateEnd.toMillis() - DateTime.local().toMillis() < 0;
    }

    /** Выдача билетов закончена, но победителей еще не определяли */
    public get isEnding(): boolean {
        return this.isTicketSaleStopped && this.dateRaffle.toMillis() - DateTime.local().toMillis() > 0;
    }

    public get isActive(): boolean {
        return this.data.Status === 1 && !this.isTicketSaleStopped;
    }

    /** TODO: пока смотрит на время окончания эмиссии билетов, будет смотреть на своё отдельное поле
     * Розыгрыш завершен
     */
    public get isEnded(): boolean {
        return this.isTicketSaleStopped;
    }

    public get status(): TLotteryStatus {
        let status: TLotteryStatus;
        if (this.data.Status === 1) {
            if (!this.isTicketSaleStopped) {
                status = 'active';
            } else if (this.isEnding) {
                status = 'ending';
            }
        } else if (this.data.Status === 0) {
            if (this.isTicketSaleStopped) {
                status = 'ended';
            }

            if (this.isWaitingForStart) {
                status = 'notStarted';
            }
        }

        return status;
    }

    private init(): void {
        this.preparePrizes();
    }

    private preparePrizes(): void {
        this.prizes = new LotteryPrizes(this.data.WinningSpread, Lottery.userCurrency);
    }
}
