export interface ICachingObject<T> {
    id: number,
    url: string,
    expiration: number,
    items: T,
}
