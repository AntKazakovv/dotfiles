import {ISvgIcons} from 'wlc-engine/interfaces/config.interface';

export const DefaultSvgIcons: ISvgIcons = {
    'default-logo': require('!raw-loader!./icons/default-logo.svg').default,
    'poweroff': require('!raw-loader!./icons/poweroff.svg').default,
    'loading': require('!raw-loader!./icons/loading.svg').default,
    'arrow': require('!raw-loader!./icons/arrow.svg').default,
};
