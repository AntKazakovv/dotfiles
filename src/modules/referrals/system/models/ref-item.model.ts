import {IRefItem} from 'wlc-engine/modules/referrals/system/interfaces/referrals.interface';

export class RefItemModel {
    private data: IRefItem;

    constructor(data: IRefItem) {
        this.data = data;
    }

    public get id(): number {
        return this.data.ID;
    }

    public get profit(): number {
        return this.data.profit;
    }
}
