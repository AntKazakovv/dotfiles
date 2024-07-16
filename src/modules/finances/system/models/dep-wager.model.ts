import {IDepWagerData} from 'wlc-engine/modules/finances/system/interfaces';

export interface IDepWager {
    depositDate: string;
    statusText: string;
    depositInfo: IDepWagerDepositInfo;
}

export interface IDepWagerDepositInfo {
    value: number;
    currency: string;
}

export const enum DepWagerStatusEnum {
    NOT_WAGERED = 0,
    WAGERED = 1,
};

export const wageringStatuses: Record<DepWagerStatusEnum, string> = {
    0: gettext('Not wagered yet'),
    1: gettext('Successfully wagered'),
};


export class DepWagerModel implements IDepWager {
    public readonly depositInfo: IDepWagerDepositInfo;
    public readonly statusText: string;
    public readonly status: DepWagerStatusEnum;
    public readonly targetWager: number;
    public readonly currentWager: number;
    public readonly depositDate: string;

    private data: IDepWagerData;

    constructor(data: IDepWagerData, wager: number) {
        this.data = data;

        this.depositInfo = {
            value: this.data.deposit,
            currency: this.data.currency,
        };

        this.targetWager = wager;
        this.currentWager = this.data.wager;
        this.status = this.currentWager < this.targetWager
            ? DepWagerStatusEnum.NOT_WAGERED
            : DepWagerStatusEnum.WAGERED;
        this.statusText = wageringStatuses[this.status];
        this.depositDate = this.data.depositDate;
    }
}
