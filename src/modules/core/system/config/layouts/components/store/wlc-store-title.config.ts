import {ILayoutComponent} from 'wlc-engine/modules/core';
import {IStoreTitleCParams} from 'wlc-engine/modules/store/components';

export namespace wlcStoreTitle {

    export const def: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-profile-content__top',
            components: [
                {
                    name: 'store.wlc-store-title',
                    params:  <IStoreTitleCParams>{
                        customMod: ['profile'],
                        wlcElement: 'header_store',
                    },
                },
            ],
        },
    };

    export const category: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'wlc-profile-content__top',
            components: [
                {
                    name: 'store.wlc-store-title',
                    params:  <IStoreTitleCParams>{
                        customMod: ['profile'],
                        wlcElement: 'header_store',
                        type: 'store-category',
                    },
                },
            ],
        },
    };
}
