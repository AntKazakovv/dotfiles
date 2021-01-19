import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcIconList {
    export const merchants: ILayoutComponent = {
        name: 'core.wlc-icon-list',
        params: {
            type: 'merchants',
        },
    };

    export const payments: ILayoutComponent = {
        name: 'core.wlc-icon-list',
        params: {
            type: 'payments',
            theme: 'payments',
            common: {
                payment: {
                    include: [
                        'maldopay',
                        'skrill',
                        'neteller',
                        'qiwiwallet',
                        'yandexmoney',
                    ],
                    exclude: ['all'],
                },
            },
        },
    };

}
