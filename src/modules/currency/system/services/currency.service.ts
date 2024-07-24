import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {ConfigService, IIndexing} from 'wlc-engine/modules/core';
import {CurrencyModel} from 'wlc-engine/modules/currency/system/models/currency.model';
import {
    TDisplayName,
    ICurrency,
} from 'wlc-engine/modules/currency/system/interfaces/currency.interface';

@Injectable({
    providedIn: 'root',
})
export class CurrencyService {
    public currencies: ICurrency<string>[] = [];
    public regCurrencies: ICurrency<string>[] = [];

    constructor(
        protected translationService: TranslateService,
        protected configService: ConfigService,
    ) {
        this.init();
    }

    public getDisplayName(currencyName: string): string {
        return this.currencies.find((curr: ICurrency<string>) => curr.Name === currencyName).DisplayName;
    }

    public isFiat(currencyName: string): boolean {
        return !this.currencies
            .find((currency: ICurrency<string>): boolean => currency.Name === currencyName).IsCryptoCurrency;
    }

    private setCurrencies(): void {
        let currencies: IIndexing<ICurrency<TDisplayName>> =
            this.configService.get<IIndexing<ICurrency<TDisplayName>>>('appConfig.siteconfig.currencies');
        this.currencies = Object.values(currencies).map((value: ICurrency<TDisplayName>) => {
            return new CurrencyModel({}, value, this.translationService);
        });
        this.regCurrencies = this.currencies.filter((curr: ICurrency<string>) => curr.registration);
    }

    private init(): void {
        this.setCurrencies();
    }
}
