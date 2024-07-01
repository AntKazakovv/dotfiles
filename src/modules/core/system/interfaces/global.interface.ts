export interface IIndexing<T> {
    [key: string]: T;
}

export type TDeepReadonly<T> = {
    readonly [Key in keyof T]: T[Key] extends any[] | Record<string, unknown> ? TDeepReadonly<T[Key]> : T[Key];
}

export type TSortDirection = 'asc' | 'desc';

export type TDevice = 'mobile' | 'desktop';
export type TDeviceSelection = TDevice | 'any';

export type TMustHaveKeys<TKeys, TObject extends Record<keyof TKeys, any>> = TObject;

export type TUnknownFunction = (...args: unknown[]) => unknown;
