import {
    Inject,
    Injectable,
} from '@angular/core';
import {LocalStorageService} from 'ngx-webstorage';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {AbstractCache} from './classes/abstract.cache';
import {WorkerStorageCache} from './classes/workerstorage.class';
import {LocalStorageCache} from './classes/localstorage.class';
import {WINDOW} from 'wlc-engine/modules/app/system';

type TMilliSeconds = number;

@Injectable({
    providedIn: 'root',
})
export class CachingService {
    private readonly keepTimeDefault: TMilliSeconds = 10 * 60 * 1000;
    private storage: AbstractCache;
    private storageType: 'indexeddb' | 'localstorage';

    private $resolve: () => void;
    private ready: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolve = resolve;
    });

    constructor(
        private localStorageService: LocalStorageService,
        private logService: LogService,
        private configService: ConfigService,
        @Inject(WINDOW) private window: Window,
    ) {
        this.init();
    }

    /**
     * Initialize a storage and set its type
     *
     * @returns {Promise<void>}
     */
    public async init(): Promise<void> {
        let storage = new WorkerStorageCache(this.window);
        if (await storage.isAvailable) {
            this.storage = storage;
            this.storageType = 'indexeddb';
        } else {
            this.storage = new LocalStorageCache(this.localStorageService);
            this.storageType = 'localstorage';
        }
        this.$resolve();
    }

    /**
     * Get the key from the storage
     *
     * @param {string} key
     *
     * @returns the key
     */
    public async get<T>(key: string): Promise<T> {
        try {
            await this.ready;
            return this.storage.get<T>(key);
        } catch (error) {
            this.logService.sendLog({code: this.storageType === 'indexeddb' ? '0.5.2': '0.5.5', data: error});
        }
    }

    /**
     * Set the data to the storage
     *
     * @param {string} key - caching key
     * @param {T | T[]} items - caching value
     * @param {boolean} rewriting - rewrite when set to cache
     * @param {TMilliSeconds} [keepTime="this.keepTimeDefault"] - time to cache in milliseconds
     * @param {boolean} [saveKey="false"] - save caching key to localstorage to external use
     *
     * @returns {Promise<void>}
     */
    public async set<T>(
        key: string,
        items: T | T[],
        rewriting: boolean = false,
        keepTime: TMilliSeconds = this.keepTimeDefault,
        saveKey: boolean = false,
    ): Promise<void> {
        await this.ready;

        let data: T;
        try {
            data = await this.storage.get<T>(key);
        } catch (error) {
            this.logService.sendLog({code: '0.5.2', data: error});
        }

        if (!data || rewriting) {
            try {
                if (data && rewriting) {
                    await this.storage.delete(key);
                    this.configService.set({
                        name: key,
                        value: key,
                        storageClear: 'localStorage',
                    });
                }
                await this.storage.set(key, items, keepTime);
                if (saveKey) {
                    this.configService.set({
                        name: key,
                        value: key,
                        storageType: 'localStorage',
                    });
                }
            } catch (error) {
                this.logService.sendLog({code: this.storageType === 'indexeddb' ? '0.5.1': '0.5.4', data: error});
            }
        }
    }

    /**
     * Delete the key from the storage
     *
     * @param {string} key
     *
     * @returns {Promise<void>}
     */
    public async clear(key: string): Promise<void> {
        try {
            await this.ready;
            await this.storage.delete(key);
        } catch (error) {
            this.logService.sendLog({code: this.storageType === 'indexeddb' ? '0.5.3': '0.5.6', data: error});
        }
    }
}
