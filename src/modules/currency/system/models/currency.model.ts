import {TranslateService} from '@ngx-translate/core';

import {AbstractModel, IFromLog} from 'wlc-engine/modules/core';

import {
    TDisplayName,
    ICurrency,
} from 'wlc-engine/modules/currency';

export class CurrencyModel extends AbstractModel<ICurrency<TDisplayName>> {

    constructor(
        from: IFromLog,
        data: ICurrency<TDisplayName>,
        protected translateService: TranslateService) {
        super({from});
        this.data = data;
    }

    public get Name(): string {
        return this.data.Name;
    }

    public get DisplayName(): string {
        const lang = this.translateService.currentLang;

        if (!this.data.DisplayName) {
            return this.data.Name;
        }

        const name: string = this.data.DisplayName[lang] || this.data.DisplayName['en'] || this.data.Name;
        return name;
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
