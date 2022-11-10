export interface IIndexing<T> {
    [key: string]: T;
}

export enum SortDirection {
    OldFirst = 'asc',
    NewFirst = 'desc'
}
