export interface IIndexingString {
    [key: string]: string;
}

export interface IIndexingBoolean {
    [key: string]: boolean;
}

export interface IIndexingAny {
    [key: string]: any;
}

export interface IIndexingUnknown {
    [key: string]: unknown;
}

export interface IIndexing<T> {
    [key: string]: T;
}
