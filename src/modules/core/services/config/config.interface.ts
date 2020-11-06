import {IIndexing, ILayoutsConfig} from 'wlc-engine/interfaces';

/**
 * Types of storage to get or set data
 */
export type IStorageType = 'localStorage' | 'sessionStorage' | 'cookiesStorage';

export interface IGlobalConfig {
    appConfig: unknown,
    $layouts: ILayoutsConfig,
    $base: unknown,
    $static: unknown,
    $files: IIndexing<string>,
}

export interface IGetParams {
    name: string;
    config?: string;
    storageType?: IStorageType;
}

export interface ISetParams {
    name: string;
    value: any;
    storageType?: IStorageType;
    storageClear?: IStorageType;
    replace?: boolean;
    freeze?: boolean;
}
