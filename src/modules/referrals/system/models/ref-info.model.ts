import {IRefCurrency, IRefInfo} from 'wlc-engine/modules/referrals/system/interfaces/referrals.interface';

export class RefInfoModel {
    public readonly link: string;
    public readonly total: number;
    public readonly availableAmounts: IRefCurrency[];
    public readonly profitUnavailable: boolean;

    constructor({link, total, available}: IRefInfo, siteUrl: string) {
        this.link = `${siteUrl}?${link}`;
        this.total = Number(total);
        this.availableAmounts = this.prepareAmounts(available);
        this.profitUnavailable = this.availableAmounts[0].value <= 0;
    }

    protected prepareAmounts(availableComission: IRefInfo['available']): IRefCurrency[] {
        return Object.entries(availableComission)
            .map(([currency, value]: [string, number]) => ({currency, value}))
            .sort((a: IRefCurrency) => a.currency.toLowerCase() === 'eur' ? 1 : -1);
    }
}
