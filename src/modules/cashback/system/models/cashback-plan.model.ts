import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import _assign from 'lodash-es/assign';

import {
    IFromLog,
    AbstractModel,
    IIndexing,
} from 'wlc-engine/modules/core';
import {CurrencyModel} from 'wlc-engine/modules/core/system/models/currency.model';
import {ICashbackPlan} from 'wlc-engine/modules/cashback/system/interfaces/cashback.interface';

interface ICashbackStatus {
    text: string,
    date: string,
}

interface IButtonText {
    text: string,
    context?: IIndexing<string>
}

export class CashbackPlanModel extends AbstractModel<ICashbackPlan> {

    public static userCurrency: string;

    protected readonly _buttonText!: IButtonText;

    public timerEnded = false;

    constructor(
        from: IFromLog,
        data: ICashbackPlan,
        protected currentLang: string,
    ) {
        super({from: _assign({model: 'CashbackPlan'}, from)});
        this.data = data;

        this._buttonText = this.amount > 0 && this.isAvailable
            ? {
                text: gettext('Claim {{sum}}'),
                context: {
                    sum: this.createCurrencyModel().toString(),
                },
            }
            : {
                text: gettext('Claim reward'),
            };

        this.timerEnded = this.isPending ? true : false;
    }

    public get isAvailable(): boolean {
        return this.data.Available;
    }

    public get title(): string {
        return this.data.Name;
    }

    public get availableAt(): string {
        return this.data.AvailableAt;
    }

    public get period(): string {
        return this.data.Period;
    }

    public get id(): string {
        return this.data.ID;
    }

    public get type(): string {
        return this.data.Type;
    }

    protected formatDate(date: string): string {
        return dayjs(date).add(dayjs().utcOffset(), 'minute').format('YYYY-MM-DD HH:mm:ss');
    }

    public get cashbackStatus(): ICashbackStatus | null {

        const availableAt: string = this.formatDate(this.data.AvailableAt);
        const expiresAt: string = this.formatDate(this.data.ExpiresAt);

        if (availableAt) {
            return this.isAvailable
                ? {
                    text: gettext('Available for'),
                    date: expiresAt,
                } : {
                    text: gettext('Will be available in'),
                    date: availableAt,
                };
        }

        return null;
    }

    public get amount(): number {
        return Number(this.data.Amount);
    }

    public get buttonText(): IButtonText {
        return this._buttonText;
    }

    public additionalText(): string {
        switch (this.data.Period) {
            case gettext('Daily'):
                return gettext('Pamper yourself every day, ' +
                    'and we will help you with it!');
            case gettext('Weekly'):
                return gettext('Play with us for a week ' +
                    'and get your cash rewards.');
            case gettext('Biweekly'):
                return gettext('Get ready to take your ' +
                    'two-week cash prize.');
            case gettext('Monthly'):
                return gettext('Every month, you can return a part of the money you spent on betting.');
            default:
                return '';
        }
    }

    public get isPending(): boolean {
        const availableDate: Dayjs = dayjs(this.data.AvailableAt).add(dayjs().utcOffset(), 'minute');

        return (dayjs() > availableDate) && !this.isAvailable;
    }

    public get isAvailableAt(): boolean {
        return dayjs().add(-dayjs().utcOffset(), 'minute') <= dayjs(this.data.AvailableAt);
    }

    protected createCurrencyModel(): CurrencyModel {

        return new CurrencyModel(
            {
                model: 'CashbackPlanModel',
                method: 'buttonText',
            },
            this.data.Amount,
            {
                currency: CashbackPlanModel.userCurrency,
                language: this.currentLang,
            },
        );
    }
}
