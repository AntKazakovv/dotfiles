import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

import {IThumbListCParams} from '../../components/thumb-list/thumb-list.params';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IThumbsWrapperCParams extends IComponentParams<Theme, Type, ThemeMod> {
    title?: string;
    thumbListParams?: IThumbListCParams;
    decor1Path?: string;
    decor2Path?: string;
}

export const defaultParams: IThumbsWrapperCParams = {
    moduleName: 'youtube-block',
    componentName: 'wlc-thumbs-wrapper',
    class: 'wlc-thumbs-wrapper',
    title: gettext('Streamers wins'),
    decor1Path: '/wlc/youtube-block/twitch.svg',
    decor2Path: '/wlc/youtube-block/youtube.svg',
};
