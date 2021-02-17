/// <reference lib="webworker" />

import {
    get,
    set,
    del,
    clear,
    createStore,
} from 'idb-keyval';
import {DateTime} from 'luxon';

const store = createStore('wlc-cache-db', 'cache');
addEventListener('message', async ({data}) => {
    if (!globalThis.indexedDB) {
        postMessage(JSON.stringify({rid: data.rid, status: 'failed', error: 'indexedDB not supports'}));
        return;
    }

    switch (data.type) {
        case 'set':
            try {
                await set(data.key, {
                    value: data.value,
                    expiration: data.expiration,
                }, store);
                postMessage(JSON.stringify({key: data.key, rid: data.rid, status: 'success'}));
            } catch (error) {
                postMessage(JSON.stringify({key: data.key, rid: data.rid, status: 'failed'}));
            }
            break;

        case 'get': {
            try {
                const cacheData = await get(data.key, store);
                if (!cacheData) {
                    throw new Error('no cache data for key: ' + data.key);
                }
                if (cacheData.expiration < DateTime.local().toMillis()) {
                    set(data.key, null);
                    throw new Error('cache data for key: ' + data.key + ' expired');
                }
                postMessage(JSON.stringify({key: data.key, rid: data.rid, value: cacheData.value, status: 'success'}));
            } catch (error) {
                postMessage(JSON.stringify({key: data.key, rid: data.rid, error: error.toString(), status: 'failed'}));
            }
            break;
        }

        case 'delete':
            try {
                await del(data.key, store);
                postMessage(JSON.stringify({key: data.key, rid: data.rid, status: 'success'}));
            } catch (error) {
                postMessage(JSON.stringify({key: data.key, rid: data.rid, error, status: 'failed'}));
            }
            break;

        case 'clear':
            try {
                await clear(store);
                postMessage(JSON.stringify({rid: data.rid, status: 'success'}));
            } catch (error) {
                postMessage(JSON.stringify({id: data.rid, error, status: 'failed'}));
            }
            break;

        case 'check':
            postMessage(JSON.stringify({rid: data.rid, status: 'success'}));
            break;

        default:
            postMessage(JSON.stringify({rid: data.rid, error: 'Wrong request type'}));
    }
});
