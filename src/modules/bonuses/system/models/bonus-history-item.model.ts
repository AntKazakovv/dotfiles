import {
    IIndexing,
    AbstractModel,
    ConfigService,
    CachingService,
} from 'wlc-engine/modules/core';
import {
    IBonus,
} from '../interfaces/bonuses.interface';

export class HistoryItemModel extends AbstractModel<IBonus> {

    constructor(
        data: any,
    ) {
        super();
        this.data = this.modifyData(data);
    }

    public set data(data: any) {
        super.data = data;
    }

    public get data(): any {
        return super.data;
    }

    public get Name(): string {
        return this.data.Name.length > 35 ? `${this.data.Name.slice(0, 35)}...` : this.data.Name;
    }

    public get Balance(): string {
        return this.data.Balance;
    }

    public get LoyaltyPoints(): string {
        return Number(this.data.LoyaltyPoints).toFixed(2);
    }

    public get ExperiencePoints(): string {
        return Number(this.data.ExperiencePoints).toFixed(2);
    }

    public get FreeroundCount(): string {
        return this.data.FreeroundCount || '0';
    }

    public get WageringTotal(): string {
        return Number(this.data.WageringTotal).toFixed(2) || '0';
    }

    public get End(): string {
        return this.data.End;
    }

    public get Status(): string {
        return this.data.Status;
    }

    public get StatusName(): string {
        return this.data.StatusName;
    }

    protected modifyData(historyItem: any): any {
        switch (historyItem.Status) {
            case '-100' : {
                historyItem.StatusName = 'Expired';
                break;
            }
            case '-99' : {
                historyItem.StatusName = 'Canceled';
                break;
            }
            case '100' : {
                historyItem.StatusName = 'Wagered';
                break;
            }
        }

        return historyItem;
    }
}
