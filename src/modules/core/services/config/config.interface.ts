import {IIndexing, ILayoutsConfig} from 'wlc-engine/interfaces';
import {AppConfigModel} from 'wlc-engine/modules/core';

/**
 * Types of storage to get or set data
 */
export type IStorageType = 'localStorage' | 'sessionStorage' | 'cookiesStorage';

export interface IGlobalConfig {
    appConfig: AppConfigModel,
    $layouts: ILayoutsConfig,
    $static: unknown,
    $files: IIndexing<string>,
    $games: unknown,
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
    replace?: boolean;
    freeze?: boolean;
}
