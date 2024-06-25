import _map from 'lodash-es/map';

import {IRefCurrency, IRefInfo} from 'wlc-engine/modules/referrals/system/interfaces/referrals.interface';

export class RefInfoModel {
    public readonly link: string;
    public readonly total: number;
    public readonly availableAmount: IRefCurrency[];
    public readonly profitUnavailable: boolean;
    private data: IRefInfo;

    constructor(data: IRefInfo) {
        this.data = data;
        this.link = data.link;
        this.total = Number(data.total);
        this.availableAmount = this.prepareAmounts();
        this.profitUnavailable = this.availableAmount[0].value <= 0;
    }

    protected prepareAmounts(): IRefCurrency[] {

        const res: IRefCurrency[] = _map(this.data.available, (val: number, key: string) => {
            return {
                value: val,
                currency: key,
            };
        });

        if (res.length > 1) {
            res.sort((a: IRefCurrency) => a.currency.toLowerCase() === 'eur' ? 1 : -1);
        }

        return res;
    }
}
