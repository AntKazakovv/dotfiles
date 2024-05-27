import {IStoreModule} from 'wlc-engine/modules/store/system/interfaces/store.interface';

export const storeConfig: IStoreModule = {
    tagsConfig: {
        useIcons: true,
        tagList: {
            'unavailable': {
                caption: gettext('Unavailable'),
                bg: '#313131',
                iconUrl: '/wlc/icons/theme-wolf/unavailable.svg',
            },
            'bonus': {
                caption: gettext('Bonus'),
                bg: '#7d1bde',
                iconUrl: '/wlc/icons/theme-wolf/bonus.svg',
            },
            'money': {
                caption: gettext('Money'),
                bg: '#006d39',
                iconUrl: '/wlc/icons/theme-wolf/money.svg',
            },
            'money + bonus': {
                caption: gettext('Money + Bonus'),
                bg: '#587dff',
                iconUrl: '/wlc/icons/theme-wolf/money-bonus.svg',
            },
            'tournament points': {
                caption: gettext('Tournament points'),
                bg: '#df3856',
                iconUrl: '/wlc/icons/theme-wolf/tournament-points.svg',

            },
            'item': {
                caption: gettext('Item'),
                bg: '#248d80',
                iconUrl: '/wlc/icons/theme-wolf/item.svg',

            },
        },
    },
};
