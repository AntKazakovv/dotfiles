import {IComponentParams} from 'wlc-engine/modules/core';
import {IAnimateSpriteCParams} from 'wlc-engine/modules/core/components/animate-sprite/animate-sprite.params';

export type ComponentTheme = string;
export type ComponentType = string;
export type ComponentThemeMod = string;

interface ITimer {
    from?: number;
    to?: number;
}

export interface ITimeStorage {
    minutes: number;
    seconds: number;
}

export interface ICashOutTimeCParams
    extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
        text?: string;
        useSprite?: boolean;
        iconUrl?: string;
        intervalChangingValue?: number;
        animateSprite?: IAnimateSpriteCParams;
        approximatelyTime?: boolean;
        minutesText?: string;
        minutes?: ITimer;
        seconds?: ITimer;
};

export const defaultParams: ICashOutTimeCParams = {
    class: 'wlc-cash-out-time',
    moduleName: 'promo',
    componentName: 'wlc-cash-out-time',
    theme: 'default',
    minutesText: gettext('minutes'),
    text: gettext('Average cash out time'),
    intervalChangingValue: 1000 * 60 * 60,
    minutes: {
        from: 5,
        to: 15,
    },
    seconds: {
        from: 0,
        to: 59,
    },
    useSprite: false,
    iconUrl: '/gstatic/wlc/four-elements/lightning-icon.png',
    animateSprite: {
        imageUrl: '/gstatic/sprites/lightning-sprite.png',
    },
    approximatelyTime: true,
};
