import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {TVideoEvent} from 'wlc-engine/modules/youtube-block/system/interfaces/youtube-block.interface';
import {Subject} from 'rxjs';

import {IYoutubeVideoModel} from 'wlc-engine/modules/youtube-block/system/models/youtube-block.model';

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
