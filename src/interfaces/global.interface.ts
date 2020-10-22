export interface IIndexing<T> {
    [key: string]: T;
}

/**
 * @deprecated Use IIndexing<T> instead.
 */
export interface IIndexingString {
    [key: string]: string;
}

/**
 * @deprecated Use IIndexing<T> instead.
 */
export interface IIndexingAny {
    [key: string]: any;
}

/**
 * @deprecated Use IIndexing<T> instead.
 */
export interface IIndexingUnknown {
    [key: string]: unknown;
}
