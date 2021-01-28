import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {LocalStorageService} from 'ngx-webstorage';
import {DateTime} from 'luxon';
import {ICachingObject} from 'wlc-engine/modules/core/system/interfaces';
import {LogService} from 'wlc-engine/modules/core';

@Injectable({
    providedIn: 'root',
})
export class CachingService {
    private readonly keepTimeDefault = 10 * 60 * 1000;
    private readonly dbSupport: boolean;

    constructor(
        private dbService: NgxIndexedDBService,
        private localStorageService: LocalStorageService,
        private logService: LogService,
    ) {
        this.dbSupport = this.checkDbSupport();
    }

    public async get<T>(url: string): Promise<T> {
        let data: ICachingObject<T>;

        if (this.dbSupport) {
            try {
                data = await this.dbService.getByIndex('requests', 'url', url).toPromise();
            } catch (error) {
                this.logService.sendLog({code: '0.5.2', data: error});
            }
        } else {
            try {
                data = this.localStorageService.retrieve(url);
            } catch (error) {
                this.logService.sendLog({code: '0.5.5', data: error});
            }
        }

        if (!data) {
            return;
        }

        if (data.expiration < DateTime.local().toMillis()) {
            await this.clearStashing(data.id, url);
            return;
        }

        return data.items;
    }

    public async set<T>(
        url: string,
        items: T[] | T,
        rewriting = false,
        keepTime = this.keepTimeDefault,
    ): Promise<number | boolean> {
        if (this.dbSupport) {
            let data: ICachingObject<T>;

            try {
                data = await this.dbService.getByIndex('requests', 'url', url).toPromise();
            } catch (error) {
                this.logService.sendLog({code: '0.5.2', data: error});
            }

            if (!data || rewriting) {
                try {

                    if (data && rewriting) {
                        await this.clearStashing(data.id, url);
                    }

                    return this.dbService.add('requests', {
                        url,
                        expiration: DateTime.local().plus(keepTime).toMillis(),
                        items,
                    }).toPromise();
                } catch (error) {
                    this.logService.sendLog({code: '0.5.1', data: error});
                }
            }

            return data.id;
        } else {
            try {
                this.localStorageService.store(url, {
                    expiration: DateTime.local().plus(keepTime).toMillis(),
                    items,
                });
                return true;
            } catch (error) {
                this.logService.sendLog({code: '0.5.4', data: error});
            }
        }
    }

    private async clearStashing(key: number, url: string): Promise<void> {
        if (this.dbSupport) {
            try {
                await this.dbService.delete('requests', key).toPromise();
            } catch (error) {
                this.logService.sendLog({code: '0.5.3', data: error});
            }
        } else {
            try {
                this.localStorageService.clear(url);
            } catch (error) {
                this.logService.sendLog({code: '0.5.6', data: error});
            }
        }
    }

    private checkDbSupport(): boolean {
        if (!globalThis.indexedDB) {
            this.logService.sendLog({code: '0.5.0'});
            return false;
        }
        return true;
    }
}
