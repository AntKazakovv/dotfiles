import {Injectable} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import _map from 'lodash-es/map';
import _find from 'lodash-es/find';
import _filter from 'lodash-es/filter';

import {ConfigService, IIndexing} from 'wlc-engine/modules/core';
import {CurrencyModel} from 'wlc-engine/modules/currency/system/models/currency.model';
import {ICurrency, ICurrencyModel} from 'wlc-engine/modules/currency/system/interfaces/currency.interface';

@Injectable({
    providedIn: 'root',
})
export class CurrencyService {
    public currencies: ICurrencyModel[] = [];
    public regCurrencies: ICurrencyModel[] = [];
    public lang: string;

    constructor(
        protected translationService: TranslateService,
        protected configService: ConfigService,
    ) {
        this.init();
    }

    public init(): void {
        this.setCurrencies();
    }

    public setCurrencies(): void {
        let currencies: IIndexing<ICurrency> =
            this.configService.get<IIndexing<ICurrency>>('appConfig.siteconfig.currencies');
        this.currencies = _map(currencies, (value: ICurrency) => {
            return new CurrencyModel({}, value, this.translationService);
        });
        this.regCurrencies = _filter(this.currencies, (curr: ICurrencyModel) => curr.registration);
    }

    public getDisplayName(currencyName: string): string {
        return _find(this.currencies, (curr: ICurrencyModel) => curr.Name === currencyName).DisplayName;
    }
}
