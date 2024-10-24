import {
    GlobalHelper,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {IRatingCParams} from 'wlc-engine/modules/core/components/rating/rating.params';
import {IAnimateSpriteCParams} from 'wlc-engine/standalone/core/components/animate-sprite/animate-sprite.params';

export type ComponentTheme = string;
export type ComponentType = string;
export type ComponentThemeMod = string;

export interface ITopRatedCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    text?: string;
    rating?: IRatingCParams;
    animateSprite?: IAnimateSpriteCParams;
    useSprite?: boolean;
    iconUrl?: string;
};

export const defaultParams: ITopRatedCParams = {
    class: 'wlc-top-rated',
    moduleName: 'promo',
    componentName: 'wlc-top-rated',
    theme: 'default',
    rating: {
        mock: {
            use: true,
            from: 3.7,
            to: 4.8,
        },
    },
    text: gettext('Top rated 24/7 live chat support'),
    animateSprite: {
        imageUrl: GlobalHelper.gstaticUrl + '/sprites/support-sprite.png',
    },
    useSprite: false,
    iconUrl: GlobalHelper.gstaticUrl + '/wlc/four-elements/support-icon.png',
};
