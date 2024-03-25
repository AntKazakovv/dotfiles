import {TranslateService} from '@ngx-translate/core';

import {AbstractModel, IFromLog} from 'wlc-engine/modules/core';

import {ICurrency} from '../interfaces/currency.interface';

export class CurrencyModel extends AbstractModel<ICurrency> {

    constructor(
        from: IFromLog,
        data: ICurrency,
        protected translate: TranslateService) {
        super({from});
        this.data = data;
    }

    public get Name(): string {
        return this.data.Name;
    }

    public get DisplayName(): string {
        const lang = this.translate.currentLang;

        if (!this.data.DisplayName) {
            return this.data.Name;
        }

        if (this.data.DisplayName[lang]) {
            return this.data.DisplayName[lang];
        } else {
            return this.data.DisplayName['en'];
        }
    }

    public get Alias(): string {
        return this.data.Alias;
    }

    public get ExRate(): string {
        return this.data.ExRate;
    }

    public get ID(): string | number {
        return this.data.ID;
    }

    public get IsCryptoCurrency(): boolean {
        return this.data.IsCryptoCurrency;
    }

    public get registration(): boolean {
        return this.data.registration;
    }
}
