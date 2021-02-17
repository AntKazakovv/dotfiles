export abstract class AbstractCache {
    abstract get<T>(key: string): Promise<T>;
    abstract set<T>(key: string, value: T, keepTime: number): Promise<T>;
    abstract delete(key: string): Promise<void>;
    abstract clear(): Promise<void>;
}
