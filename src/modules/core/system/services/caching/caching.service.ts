import {
    Inject,
    Injectable,
} from '@angular/core';
import {LocalStorageService} from 'ngx-webstorage';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {AbstractCache} from './classes/abstract.cache';
import {WorkerStorageCache} from './classes/workerstorage.class';
import {LocalStorageCache} from './classes/localstorage.class';
import {WINDOW} from 'wlc-engine/modules/app/system';

@Injectable({
    providedIn: 'root',
})
export class CachingService {
    private readonly keepTimeDefault = 10 * 60 * 1000;
    private storage: AbstractCache;
    private storageType: 'indexeddb' | 'localstorage';

    private $resolve: () => void;
    private ready: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolve = resolve;
    });

    constructor(
        private localStorageService: LocalStorageService,
        private logService: LogService,
        @Inject(WINDOW) private window: Window,
    ) {
        this.init();
    }

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

    public async get<T>(key: string): Promise<T> {
        try {
            await this.ready;
            return this.storage.get<T>(key);
        } catch (error) {
            this.logService.sendLog({code: this.storageType === 'indexeddb' ? '0.5.2': '0.5.5', data: error});
        }
    }

    public async set<T>(
        key: string,
        items: T | T[],
        rewriting = false,
        keepTime = this.keepTimeDefault,
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
                }
                await this.storage.set(key, items, keepTime);
            } catch (error) {
                this.logService.sendLog({code: this.storageType === 'indexeddb' ? '0.5.1': '0.5.4', data: error});
            }
        }
    }

    public async clear(key: string): Promise<void> {
        try {
            await this.ready;
            await this.storage.delete(key);
        } catch (error) {
            this.logService.sendLog({code: this.storageType === 'indexeddb' ? '0.5.3': '0.5.6', data: error});
        }
    }
}
