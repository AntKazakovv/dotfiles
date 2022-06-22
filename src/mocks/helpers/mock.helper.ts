/* eslint-disable no-restricted-globals */
import {datatype} from 'faker';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {IGame} from 'wlc-engine/modules/games';

export class MockHelper {

    public static games: IGame[];

    public static get lang(): string {
        return this.getCookieByName('sitelang') || 'en';
    }

    /**
     *  Get random game ID
     *  @returns {Promise<number>} - game ID
     */
    public static async getRandomGameID(): Promise<number> {

        if (!this.games) {
            const cache = await this.getCacheKey(`/api/v1/games|${this.lang}`);
            this.games = cache.value.games;
        }

        if (this.games?.length) {
            const index = GlobalHelper.randomNumber(0, this.games.length);
            return +this.games[index].ID;
        }

        return datatype.number({
            min: 1500000,
            max: 2000000,
        });
    }

    /**
     * Get cookie by name
     * @param name {string} - cookie name
     */
    public static getCookieByName(name: string): string {
        const value = '; ' + document.cookie;
        const parts = value.split('; ' + name + '=');

        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    }

    /**
     * Get cache from indexedDB
     * @param key {string} - cache key
     */
    public static getCacheKey(key: string): Promise<any> {
        return new Promise(function(resolve, reject) {
            const open = indexedDB.open('wlc-cache-db', 1);

            open.onerror = () => {
                reject(open.error);
            };

            open.onsuccess = function() {
                const db = open.result;
                const tx = db.transaction(['cache'], 'readonly');
                const store = tx.objectStore('cache');
                const getKey = store.get(key);

                getKey.onsuccess = function() {
                    resolve(getKey.result);
                };

                tx.onerror = function () {
                    reject(tx.error);
                };

                tx.oncomplete = function () {
                    db.close();
                };
            };
        });
    }
}
