import {IBonusesListCParams} from 'wlc-engine/modules/bonuses';
import {ILayoutComponent} from 'wlc-engine/modules/core';
import {IPreloaderCParams} from 'wlc-engine/modules/core/components/preloader/preloader.params';
export namespace wlcPromotionsBonusesList {
    export const def: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-list',
        params: <IBonusesListCParams>{
            theme: 'promo',
            common: {
                filter: 'all',
                filterByGroup: 'Promo',
                sortOrder: ['active', 'promocode', 'subscribe', 'inventory'],
            },
            redirectBtnToProfile: {
                use: true,
            },
            btnNoBonuses: {
                use: true,
            },
            preloader: {
                params: <IPreloaderCParams> {
                    block: {
                        type: 'block',
                        noContainer: true,
                        elements: [
                            {
                                type: 'block',
                                customClass: 'wlc-preloader__block--bonus-mobile',
                                amount: 4,
                                display: {
                                    mobile: true,
                                },
                                elements: [
                                    {
                                        type: 'block',
                                        elements: [
                                            {
                                                type: 'title',
                                            },
                                            {
                                                type: 'circle',
                                                amount: 2,
                                            },
                                        ],
                                    },
                                    {
                                        type: 'block',
                                        elements: [
                                            {
                                                type: 'title',
                                            },
                                            {
                                                type: 'button',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                type: 'block',
                                customClass: 'wlc-preloader__block--bonus',
                                amount: 4,
                                display: {
                                    mobile: false,
                                },
                                elements: [
                                    {
                                        type: 'block',
                                        elements: [
                                            {
                                                type: 'title',
                                                amount: 3,
                                            },
                                            {
                                                type: 'line',
                                                amount: 3,
                                            },
                                            {
                                                type: 'button',
                                            },
                                        ],
                                    },
                                    {
                                        type: 'block',
                                        elements: [
                                            {
                                                type: 'circle',
                                                amount: 2,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
        },
    };
};
