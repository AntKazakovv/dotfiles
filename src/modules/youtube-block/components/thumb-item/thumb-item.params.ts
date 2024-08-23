import {Subject} from 'rxjs';

import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {TVideoEvent} from '../../system/interfaces/youtube-block.interface';
import {IYoutubeVideoModel} from '../../system/models/youtube-block.model';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IThumbItemCParams extends IComponentParams<Theme, Type, ThemeMod> {
    video: IYoutubeVideoModel;
    events$: Subject<TVideoEvent>;
    playBtnPath?: string;
}

export const defaultParams: Omit<IThumbItemCParams, 'video' | 'events$'> = {
    moduleName: 'youtube-block',
    componentName: 'wlc-thumb-item',
    class: 'wlc-thumb-item',
    playBtnPath: '/wlc/youtube-block/play.svg',
};
