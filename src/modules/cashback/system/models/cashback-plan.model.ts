import {TranslateService} from '@ngx-translate/core';
import {DateTime} from 'luxon';
import _assign from 'lodash-es/assign';

import {
    ConfigService,
    IFromLog,
    AbstractModel,
} from 'wlc-engine/modules/core';
import {CurrencyModel} from 'wlc-engine/modules/core/system/models/currency.model';
import {ICashbackPlan} from 'wlc-engine/modules/cashback/system/interfaces/cashback.interface';

interface ICashbackStatus {
    text: string,
    date: string,
}

export class CashbackPlanModel extends AbstractModel<ICashbackPlan> {

    public static userCurrency: string;

    constructor(
        from: IFromLog,
        data: ICashbackPlan,
        protected translate: TranslateService,
        protected configService: ConfigService,
    ) {
        super({from: _assign({model: 'CashbackPlan'}, from)});
        this.data = data;
    }

    public get isAvailable(): boolean {
        return this.data.Available;
    }

    public get title(): string {
        return this.data.Name;
    }

    public get periodTitle(): string {
        return `${this.translate.instant(gettext('Period'))}: ${this.translate.instant(gettext(this.data.Period))}`;
    }

    public get id(): string {
        return this.data.ID;
    }

    protected formatDate(date: string): string {
        return DateTime.fromSQL(date, {zone: 'utc'}).toLocal().toFormat('yyyy-LL-dd HH:mm:ss');
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

    public get buttonText(): string {

        return this.amount > 0 && this.isAvailable
            ? this.translate.instant(gettext('Claim')) + ` ${this.createCurrencyModel()}`
            : gettext('Get cashback');
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
        const availableDate: DateTime = DateTime.fromSQL(this.data.AvailableAt, {zone: 'utc'}).toLocal();

        return (DateTime.local() > availableDate) && !this.isAvailable;
    }

    public get isAvailableAt(): boolean {
        return DateTime.utc() <= DateTime.fromSQL(this.data.AvailableAt);
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
                language: this.translate.currentLang,
            },
        );
    }
}
