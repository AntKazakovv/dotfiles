import {
    PartialObserver,
    Observable,
} from 'rxjs';

import {
    IIndexing,
    ISelectCParams,
} from 'wlc-engine/modules/core';
import {ITagCommon} from 'wlc-engine/modules/core/components/tag/tag.params';
import {StoreItem} from '../models/store-item.model';
import {StoreCategory} from 'wlc-engine/modules/store/system/models/store-category.model';

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
    PriceMoney: IStoreItemPriceMoney;
    Quantity: string;
    RepeatBuyRestriction: string;
    Status: string;
    IsItemAvailable: string;
    Type: string;
    IDBonus?: string;
    BonusEventAmount?: string;
    BonusInfo?: IStoreBonusInfo;
    NextDateAvailable?: string;
}

export interface IStoreItemPrice {
    LOYALTY: string;
    EXPERIENCE: string;
    // all currencies
    [key: string]: string;
}

export interface IStoreBonusInfo {
    Description: IIndexing<string>;
    Image: IIndexing<string>;
    Name: IIndexing<string>;
    Terms: IIndexing<string>;
}

export interface IStoreCategory {
    ID: string;
    Name: string | IIndexing<string>;
    Order: string;
    Status: string;
}

export interface IStoreResponse {
    Categories: IStoreCategory[];
    Items: IStoreItem[];
}

export interface IStore {
    categories: StoreCategory[];
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

export interface IDisabledItemInfo {
    messageText?: string;
    btnText?: string;
}

export type TStoreTagKey = 'unavailable'
    | 'bonus'
    | 'money'
    | 'money + bonus'
    | 'tournament points'
    | 'item'
    | '';

export interface IStoreTagsConfig {
    useIcons: boolean;
    tagList?: Partial<Record<TStoreTagKey, ITagCommon>>;
}

export interface IStoreModule {
    tagsConfig?: IStoreTagsConfig;
    storeFilterConfig?: ISelectCParams<TStoreFilter>;
}

export type TStoreFilter = 'all' | 'available' | 'unavailable';

export interface IStoreFilterValue {
    filterValue: TStoreFilter;
}

export interface IStoreItemTotalPrice {
    loyaltyPrice?: number,
    expPrice?: number,
    moneyPrice?: number,
    moneyCurrency?: string,
}

export interface IStoreItemPriceMoney {
    [key: string]: string;
}
