import {ISvgIcons} from 'wlc-engine/interfaces/config.interface';

export const DefaultSvgIcons: ISvgIcons = {
    'default-logo': require('!raw-loader!./default-logo.svg').default,
    'poweroff': require('!raw-loader!./poweroff.svg').default,
    'loading': require('!raw-loader!./loading.svg').default,
};
