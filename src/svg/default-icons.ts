import {ISvgIcons} from 'wlc-engine/interfaces/config.interface';

export const DefaultSvgIcons: ISvgIcons = {
    'default-logo': require('!raw-loader!./icons/default-logo.svg').default,
    'poweroff': require('!raw-loader!./icons/poweroff.svg').default,
    'loading': require('!raw-loader!./icons/loading.svg').default,
    'arrow': require('!raw-loader!./icons/arrow.svg').default,
    'thin-arrow': require('!raw-loader!./icons/thin-arrow.svg').default,
    'fullscreen': require('!raw-loader!./icons/fullscreen.svg').default,
    'close': require('!raw-loader!./icons/close.svg').default,
    'favourite': require('!raw-loader!./icons/favourite.svg').default,
    'eye': require('!raw-loader!./icons/eye.svg').default,
    'tick': require('!raw-loader!./icons/tick.svg').default,
    'search': require('!raw-loader!./icons/search.svg').default,
    'filter': require('!raw-loader!./icons/filter.svg').default,
    'age-restrictions': require('!raw-loader!./icons/age-restrictions.svg').default,
    'info': require('!raw-loader!./icons/info.svg').default,
};
