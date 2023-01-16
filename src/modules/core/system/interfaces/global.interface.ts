export interface IIndexing<T> {
    [key: string]: T;
}

export type TSortDirection = 'asc' | 'desc';

export type TMustHaveKeys<TKeys, TObject extends Record<keyof TKeys, any>> = TObject;
