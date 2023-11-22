import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import {IProviderGamesCParams} from 'wlc-engine/modules/games/components/provider-games/provider-games.params';
import {IProviderLinksCParams} from 'wlc-engine/modules/games/components/provider-links/provider-links.params';

export namespace providers {
    export const slider: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'games.wlc-provider-links',
                params: <IProviderLinksCParams>{
                    iconsType: 'color',
                    colorIconBg: 'dark',
                },
            },
        ],
    };

    export const linksThemeModWolf: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        components: [
            {
                name: 'games.wlc-provider-links',
                params: <IProviderLinksCParams>{
                    type: 'default',
                    themeMod: 'wolf',
                    iconsType: 'color',
                    colorIconBg: 'dark',
                },
            },
        ],
    };

    export const linksInfoThemeWolf: ILayoutSectionConfig = {
        container: true,
        theme: 'wolf',
        components: [
            {
                name: 'static.wlc-post',
                params: {
                    showTitle: true,
                    hideWithoutData: true,
                    slug: 'providers',
                    noContent: {
                        hide: true,
                    },
                },
            },
        ],
    };

    export const games: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'games.wlc-provider-games',
                params: <IProviderGamesCParams>{
                    iconType: 'color',
                    colorIconBg: 'dark',
                },
            },
        ],
    };

    export const gamesThemeModWolf: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'games.wlc-provider-games',
                params: <IProviderGamesCParams>{
                    themeMod: 'wolf',
                    showWithoutCategories: true,
                    iconType: 'color',
                    colorIconBg: 'dark',
                    gamesGridCategoryParams: {
                        themeMod: 'wolf',
                        usePlaceholders: true,
                        showTitle: false,
                        showProgressBar: false,
                        gamesRows: 2,
                        byState: false,
                        hideEmpty: true,
                        moreBtn: {
                            hide: false,
                            lazy: false,
                            lazyTimeout: 1000,
                            scrollToEnd: false,
                        },
                        btnLoadMore: {
                            theme: 'theme-wolf-link',
                        },
                    },
                },
            },
        ],
    };

    export const sliderColorDark: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'games.wlc-provider-links',
                params: <IProviderLinksCParams>{
                    iconsType: 'color',
                    colorIconBg: 'dark',
                },
            },
        ],
    };

    export const adaptiveProviders: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'games.wlc-provider-links',
                display: {
                    after: 720,
                },
                params: <IProviderLinksCParams>{
                    iconsType: 'color',
                    colorIconBg: 'dark',
                },
            },
            {
                name: 'games.wlc-provider-links',
                display: {
                    before: 719,
                },
                params: <IProviderLinksCParams>{
                    iconsType: 'color',
                    colorIconBg: 'dark',
                    themeMod: 'adaptive',
                    type: 'mobile',
                },
            },
        ],
    };

    export const gamesColorDark: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'games.wlc-provider-games',
                params: <IProviderGamesCParams>{
                    iconsType: 'color',
                    colorIconBg: 'dark',
                },
            },
        ],
    };
}
