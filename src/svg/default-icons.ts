import {ISvgIcons} from 'wlc-engine/interfaces/config.interface';

export const DefaultSvgIcons: ISvgIcons = {
    'default-logo': require('!raw-loader!./icons/default-logo.svg').default,
    'poweroff': require('!raw-loader!./icons/poweroff.svg').default,
    'loading': require('!raw-loader!./icons/loading.svg').default,
    'arrow': require('!raw-loader!./icons/arrow.svg').default,
    'thin-arrow': require('!raw-loader!./icons/thin-arrow.svg').default,
    'eye': require('!raw-loader!./icons/eye.svg').default,
    'tick': require('!raw-loader!./icons/tick.svg').default,
    'close': require('!raw-loader!./icons/close.svg').default,
};
