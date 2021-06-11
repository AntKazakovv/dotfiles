import {AbstractCache} from './abstract.cache';
import {LocalStorageService} from 'ngx-webstorage';
import {DateTime} from 'luxon';

export class LocalStorageCache extends AbstractCache {

    private cachePrefix: string = 'wlc-cache';

    constructor(
        private storage: LocalStorageService,
    ) {
        super();
    }

    public async get<T>(key: string): Promise<T> {
        const data = this.storage.retrieve(this.getKey(key));
        if (!data) {
            return;
        }
        if (data.expiration < DateTime.local().toMillis()) {
            await this.delete(this.getKey(key));
            return;
        }
        return data.value;
    }

    public set<T>(key: string, value: T, keepTime: number): Promise<T> {
        this.addKey(key);
        return this.storage.store(this.getKey(key), {
            expiration: DateTime.local().plus(keepTime).toMillis(),
            value,
        });
    }

    public async delete(key: string): Promise<void> {
        this.removeKey(key);
        this.storage.clear(this.getKey(key));
    }

    public async clear(): Promise<void> {
        const keys: string[] = this.getKeys();
        keys.forEach((item) => {
            this.storage.clear(this.getKey(item));
        });
        this.storage.store(this.getKey('$keys'), []);
    }

    private getKey(key: string): string {
        return `${this.cachePrefix}:${key}`;
    }

    private async addKey(key: string): Promise<void> {
        const keys: string[] = this.getKeys();
        keys.push(key);
        this.storage.store(this.getKey('$keys'), keys);
    }

    private async removeKey(key: string): Promise<void> {
        const keys: string[] = this.getKeys();
        this.storage.store(this.getKey('$keys'),
            keys.filter((item: string) => item !== key));
    }

    private getKeys(): string[] {
        return this.storage.retrieve(this.getKey('$keys')) || [];
    }
}
