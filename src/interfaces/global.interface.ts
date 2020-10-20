export interface IIndexing<T> {
    [key: string]: T;
}

/**
 * @deprecated
 */
export interface IIndexingString {
    [key: string]: string;
}

/**
 * @deprecated
 */
export interface IIndexingAny {
    [key: string]: any;
}

/**
 * @deprecated
 */
export interface IIndexingUnknown {
    [key: string]: unknown;
}
