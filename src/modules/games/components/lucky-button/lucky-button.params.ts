import {IComponentParams} from 'wlc-engine/modules/core';
import {IAnimateSpriteCParams} from 'wlc-engine/modules/core/components/animate-sprite/animate-sprite.params';

export type ComponentTheme = string;
export type ComponentType = string;
export type ComponentThemeMod = string;

export interface IFeelingLuckyButtonCParams
    extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
        text?: string;
        actionText?: string;
        actionTextIcon?: string;
        animateSprite?: IAnimateSpriteCParams;
        actionType?: 'random-game' | 'carousel';
        useSprite?: boolean;
        iconUrl?: string;
};

export const defaultParams: IFeelingLuckyButtonCParams = {
    class: 'wlc-lucky-button',
    moduleName: 'games',
    componentName: 'wlc-lucky-button',
    theme: 'default',
    text: gettext('Feeling Lucky?'),
    actionText: gettext('Random game'),
    actionTextIcon: '/wlc/icons/arrow-right.svg',
    animateSprite: {
        imageUrl: '/gstatic/sprites/dice-sprite.png',
    },
    actionType: 'random-game',
    useSprite: false,
    iconUrl: '/gstatic/wlc/four-elements/dice-icon.png',
};
