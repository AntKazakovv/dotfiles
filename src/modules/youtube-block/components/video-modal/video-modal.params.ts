import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

import {IYoutubeVideoModel} from '../../system/models/youtube-block.model';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IVideoModalCParams extends IComponentParams<Theme, Type, ThemeMod> {
    thumb: IYoutubeVideoModel;
}

export const defaultParams: Omit<IVideoModalCParams, 'thumb'> = {
    moduleName: 'youtube-block',
    componentName: 'wlc-video-modal',
    class: 'wlc-video-modal',
};
