import {
    IIndexing,
    ILayoutsConfig,
    ILoyaltyConfig,
} from 'wlc-engine/modules/core/system/interfaces';
import {AppConfigModel} from 'wlc-engine/modules/core';
import {IGamesConfig} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {IStaticConfig} from 'wlc-engine/modules/static/system/interfaces/static.interface';

/**
 * Types of storage to get or set data
 */
export type IStorageType = 'localStorage' | 'sessionStorage' | 'cookiesStorage';

export interface IGlobalConfig {
    appConfig: AppConfigModel;
    $layouts: ILayoutsConfig;
    $panelsLayouts: ILayoutsConfig;
    $static: IStaticConfig;
    $files: IIndexing<string>;
    $games: IGamesConfig;
    $loyalty: ILoyaltyConfig;
}

export interface IGetParams {
    name: string;
    storageType?: IStorageType;
}

export interface ISetParams<T> {
    name: string;
    value: T;
    storageType?: IStorageType;
    storageClear?: IStorageType;
    merge?: boolean;
    freeze?: boolean;
}
