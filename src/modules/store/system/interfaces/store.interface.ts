import {IIndexing} from 'wlc-engine/modules/core';
import {StoreItem} from '../models/store-item';
import {
    PartialObserver,
    Observable,
} from 'rxjs';

export interface IStoreOrder {
    AddDate: string;
    Amount: string;
    ID: string;
    IDClient: string;
    IDItem: string;
    IDTransaction: string;
    IDUser: string;
    Name: string;
    NextDateAvailable: string;
    Note: string;
    Quantity: string;
    Status: string;
    Updated: string;
    StatusText?: string;
    Date?: any;
    transaction: {
        Amount: string;
        Date: string;
        DateISO: string;
        ID: string;
        Note: string;
        Status: number;
        System: string;
    };
}
export interface IStoreItem {
    AddDate: string;
    AvailableForLevels: string;
    CreditTournamentPoints: string;
    Categories: any[];
    Description: string;
    ID: string;
    Image: string;
    Name: string;
    Order: string;
    Price: IStoreItemPrice;
    Quantity: string;
    RepeatBuyRestriction: string;
    Status: string;
    IDBonus?: string;
    BonusEventAmount?: string;
    BonusInfo?: IStoreBonusInfo;
}

export interface IStoreItemPrice {
    LOYALTY: string;
    EXPERIENCE: string;
    EUR?: string;
}

export interface IStoreBonusInfo {
    Description: IIndexing<string>;
    Image: IIndexing<string>;
    Name: IIndexing<string>;
    Terms: IIndexing<string>;
}

export interface IStoreCategory {
    ID: string;
    Name: string;
    Order: string;
    Status: string;
}

export interface IStoreResponse {
    Categories: IStoreCategory[];
    Items: IStoreItem[];
}

export interface IStore {
    categories: IStoreCategory[];
    items: StoreItem[];
}

export interface IStoreBuyResponse {
    Balance: number;
    BalanceLeft: number;
    Credit: string;
    ID: number;
    IDItem: string;
    IDTransaction: number;
    IDUser: string;
    ItemName: IIndexing<string>;
    ItemsLeft: number;
}

export type StoreRestType = 'all' | 'orders';

export interface IGetSubscribeParams {
    useQuery: boolean;
    observer: PartialObserver<IStore | IStoreOrder[]>;
    type?: StoreRestType;
    until?: Observable<unknown>;
}
