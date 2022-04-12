import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes';
import {CountUpOptions} from 'countup.js';
import {INoContentCParams} from 'wlc-engine/modules/core/components/no-content/no-content.params';
import {IAnimateSpriteCParams} from 'wlc-engine/modules/core/components/animate-sprite/animate-sprite.params';


export type ComponentTheme = 'default' | 'info' | CustomType;
export type ComponentType = 'default' | CustomType;
export type TotalJackpotNoContentByThemeType = Partial<Record<ComponentTheme, INoContentCParams>>;

export interface ITotalJackpotCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    countUpOptions?: CountUpOptions;
    noContent?: TotalJackpotNoContentByThemeType;
    animateOnClick?: boolean;
    text?: string;
    animateSprite?: IAnimateSpriteCParams
}

export const defaultParams: ITotalJackpotCParams = {
    class: 'wlc-total-jackpot',
    moduleName: 'games',
    componentName: 'wlc-total-jackpot',
    theme: 'default',
    animateOnClick: false,
    text: gettext('Total jackpot to be won'),
    countUpOptions: {
        separator: ' ',
        decimalPlaces: 0,
        decimal: ',',
    },
    animateSprite: {
        imageUrl: '/gstatic/sprites/star-sprite.png',
    },
};

