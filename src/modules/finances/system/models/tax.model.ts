import _each from 'lodash-es/each';

import {ICalculatedTax} from 'wlc-engine/modules/finances/components/tax-info/tax-info.params';
import {ITaxData, ITaxItem, TPaymentsMethods} from 'wlc-engine/modules/finances/system/interfaces';

export class TaxModel {
    protected limitBorders: number[];
    protected amountInterval: number;
    protected taxes: ITaxItem[];

    private data: ITaxData;
    private _mode: TPaymentsMethods;
    private _userAmount: number;

    constructor(data: ITaxData) {
        this.data = data;
    }

    public set mode(val: TPaymentsMethods) {
        this._mode = val;
    }

    public get mode(): TPaymentsMethods {
        return this._mode;
    }

    public set userAmount(amount: number) {
        this._userAmount = amount;
        this.calcAmountInterval();
    }

    /** Returns sum of taxes (fixed tax + percent tax) */
    public get tax(): number {
        return Number(this.currentTaxes.tax_amount || 0)
            + (this._userAmount - this.currentTaxes.fixedSum) * (this.taxPercent / 100);
    }

    /** Returns user amount with applied taxes */
    public get totalAmount(): number {
        return this._userAmount - this.tax;
    }

    /** Returns current percent value of tax */
    public get taxPercent(): number {
        return Number(this.currentTaxes.tax_percent);
    }

    protected get currentTaxes(): ITaxItem {
        return this.taxes[this.amountInterval];
    }

    public getTaxes(amount: number, mode: TPaymentsMethods): ICalculatedTax {
        if (this.mode !== mode) {
            this.prepareData(mode);
        }

        this.userAmount = amount;

        return {
            tax: this.tax,
            totalAmount: this.totalAmount,
        };
    }

    protected prepareData(mode: TPaymentsMethods): void {
        this.mode = mode;

        const borders: number[] = [];
        const taxes: ITaxItem[] = [];

        _each(this.data[this.mode], (item: ITaxItem, key: string) => {
            const borderSum = Number(key);
            taxes.push({
                ...item,
                fixedSum: borderSum,
            });

            if (borderSum) {
                borders.push(borderSum);
            }
        });

        this.limitBorders = borders;
        this.taxes = taxes;
    }

    protected calcAmountInterval(): void {
        let index = 0;
        for(; index < this.limitBorders.length; index++) {
            if (this._userAmount <= this.limitBorders[index]) {
                this.amountInterval = index;
                return;
            }
        }
        this.amountInterval = index;
    }
}
