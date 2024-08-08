import {
    Component,
    Inject,
    ChangeDetectionStrategy,
    OnInit,
} from '@angular/core';

import {ConfigService, GlobalHelper} from 'wlc-engine/modules/core';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {WalletHelper} from 'wlc-engine/modules/multi-wallet';

import {IHistoryNameItem} from './history-name.params';
import * as Params  from './history-name.params';

@Component({
    selector: '[wlc-history-name]',
    templateUrl: './history-name.component.html',
    styleUrls: ['./styles/history-name.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryNameComponent extends AbstractComponent implements OnInit {

    public override $params: Params.IHistoryNameParams;
    public isBetHistoryItem: boolean;
    public isTransactionsHistoryItem: boolean;
    public mainInfo: string;
    public additionalInfo: string;
    public itemCurrency: string;

    protected readonly isMultiWalletOn: boolean = this.configService.get('appConfig.siteconfig.isMultiWallet');
    protected readonly WalletHelper = WalletHelper;

    constructor(
        @Inject('injectParams') protected params: Params.IHistoryNameParams,
        @Inject(WINDOW) private window: Window,
        configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.IHistoryNameParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.isBetHistoryItem = this.$params.item.historyType === 'bets';
        this.isTransactionsHistoryItem = this.$params.item.historyType === 'transactions';
        this.mainInfo = this.getMainInfo();
        this.additionalInfo = this.getAdditionalInfo();
        this.itemCurrency = this.getItemCurrency();
    }

    public getIconUrl(currency: string): string {
        return `/wlc/icons/currencies/${currency.toLowerCase()}.svg`;
    }

    protected getMainInfo(): string {
        switch (this.$params.item.historyType) {
            case 'bets':
                const date = (this.$params.item as Params.IFinancialHistoryNameItem).date;

                return GlobalHelper.toLocalTime(
                    date,
                    'SQL',
                    (this.window.innerWidth < 480) ? this.$params.previewBetDateFormat.mobile
                        : this.$params.previewBetDateFormat.desktop,
                );
            case 'transactions':
                return (this.$params.item as Params.IFinancialHistoryNameItem).date;
            case 'bonuses':
            case 'orders':
            case 'tournaments':
                return (this.$params.item as Params.IHistoryNameItem).name;
        }
    }

    protected getAdditionalInfo(): string {
        if (this.isBetHistoryItem || this.isTransactionsHistoryItem) {
            return (this.$params.item as Params.IFinancialHistoryNameItem).amount;
        } else {
            return (this.$params.item as Params.IHistoryNameItem).status;
        }
    }

    protected getItemCurrency(): string {
        if (this.isBetHistoryItem || this.isTransactionsHistoryItem) {
            return (this.$params.item as Params.IFinancialHistoryNameItem).currency;
        } else {
            return '';
        }
    }

    protected getItemID(): string {
        return (this.$params.item as IHistoryNameItem)?.id || '';
    }
}
