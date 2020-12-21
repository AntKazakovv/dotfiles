import {Injectable, Injector} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DateTime} from 'luxon';
import {ICachingObject} from 'wlc-engine/modules/core/system/interfaces';
import {LogService} from 'wlc-engine/modules/core';

@Injectable({
    providedIn: 'root',
})
export class CachingService {
    private readonly keepTimeDefault = 10 * 60 * 1000;

    constructor(
        private dbService: NgxIndexedDBService,
        private injector: Injector,
        private logService: LogService,
    ) {}

    public async unStashRequest<T>(url: string): Promise<T> {
        if (!this.checkDbSupport()) {
            return;
        }
        try {
            const data: ICachingObject<T> = await this.dbService
                .getByIndex('requests', 'url', url)
                .toPromise();

            if(!data) {
                return;
            }

            if (data.expiration < DateTime.local().toMillis()) {
                await this.clearStashing(data.id);
                return;
            }

            return data.items;
        } catch (error) {
            this.logService.sendLog({code: '0.5.2', data: error});
        }
    }

    public async stashRequest<T>(url: string, items: T[], keepTime = this.keepTimeDefault): Promise<number> {
        if (!this.checkDbSupport()) {
            return;
        }
        try {
            const data: ICachingObject<T> = await this.dbService
                .getByIndex('requests', 'url', url)
                .toPromise();

            if (!data) {
                return this.dbService.add('requests', {
                    url,
                    expiration: DateTime.local().plus(keepTime).toMillis(),
                    items,
                }).toPromise();
            }
            return data.id;
        } catch (error) {
            this.logService.sendLog({code: '0.5.1', data: error});
        }
    }

    private async clearStashing(key: number): Promise<void> {
        try {
            await this.dbService
                .delete('requests', key)
                .toPromise();
        } catch (error) {
            this.logService.sendLog({code: '0.5.3', data: error});
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
