import {DBConfig} from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
    name: 'wlc-db',
    version: 1,
    objectStoresMeta: [
        {
            store: 'requests',
            storeConfig: {keyPath: 'id', autoIncrement: true},
            storeSchema: [
                {name: 'url', keypath: 'url', options: {unique: true}},
                {name: 'expiration', keypath: 'expiration', options: {unique: false}},
                {name: 'items', keypath: 'items', options: {unique: false}},
            ],
        },
    ],
};
