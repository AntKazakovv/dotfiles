import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import {IProviderGamesCParams} from 'wlc-engine/modules/games/components/provider-games/provider-games.params';
import {IProviderLinksCParams} from 'wlc-engine/modules/games/components/provider-links/provider-links.params';

export namespace providers {
    export const slider: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'games.wlc-provider-links',
                params: {
                    iconsType: 'color',
                    colorIconBg: 'dark',
                } as IProviderGamesCParams,
            },
        ],
    };

    export const games: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'games.wlc-provider-games',
                params: {
                    iconType: 'color',
                    colorIconBg: 'dark',
                } as IProviderGamesCParams,
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
