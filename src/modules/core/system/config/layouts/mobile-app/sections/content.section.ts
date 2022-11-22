import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace content {
    export const welcome: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcWelcome.def,
        ],
    };

    export const empty: ILayoutSectionConfig = {
        container: true,
        components: [
        ],
    };

    export const gamePlay: ILayoutSectionConfig = {
        order: 2,
        components: [
            componentLib.wlcGameWrapper.def,
        ],
    };

    export const promotions: ILayoutSectionConfig = {
        order: 2,
        container: true,
        components: [
            componentLib.wlcTitle.promotions,
            componentLib.wlcPromotionsBonusesList.def,
        ],
    };

    export const withWpPromotions: ILayoutSectionConfig = {
        order: 2,
        container: true,
        components: [
            componentLib.wlcWpPromo.def,
            componentLib.wlcTitle.bonuses,
            componentLib.wlcPromotionsBonusesList.def,
        ],
    };

    export const homePromotions: ILayoutSectionConfig = {
        order: 2,
        container: true,
        components: [
            componentLib.wlcWpPromo.defUntitled,
        ],
    };

    export const sportsbook: ILayoutSectionConfig = {
        order: 2,
        container: false,
        components: [
            componentLib.wlcSportsbook.def,
        ],
    };

    export const sportsbookBetradar: ILayoutSectionConfig = {
        order: 2,
        container: false,
        components: [
            componentLib.wlcSportsbook.betradar,
        ],
    };

    export const sportsbookDigitain: ILayoutSectionConfig = {
        order: 2,
        container: false,
        components: [
            componentLib.wlcSportsbook.digitain,
        ],
    };

    export const sportsbookPinnacleSW: ILayoutSectionConfig = {
        order: 2,
        container: false,
        components: [
            componentLib.wlcSportsbook.pinnacleSW,
        ],
    };

    export const sportsbookAltenar: ILayoutSectionConfig = {
        order: 2,
        container: false,
        components: [
            componentLib.wlcSportsbook.altenar,
        ],
    };

    export const sportsbookTglab: ILayoutSectionConfig = {
        order: 2,
        container: false,
        components: [
            componentLib.wlcSportsbook.tglab,
        ],
    };

    export const sportsbookBti: ILayoutSectionConfig = {
        order: 2,
        container: false,
        components: [
            componentLib.wlcSportsbook.bti,
        ],
    };

    export const sportsbookEsport: ILayoutSectionConfig = {
        order: 2,
        container: false,
        components: [
            componentLib.wlcSportsbook.esport,
        ],
    };

    export const sportsbookNova: ILayoutSectionConfig = {
        order: 2,
        container: false,
        components: [
            componentLib.wlcSportsbook.nova,
        ],
    };

    export const error: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcErrorPage.def,
        ],
    };

    export const offline: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcOfflinePage.def,
        ],
    };
}

