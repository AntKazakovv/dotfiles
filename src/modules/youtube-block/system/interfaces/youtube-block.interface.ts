import {IYoutubeVideoModel} from 'wlc-engine/modules/youtube-block/system/models/youtube-block.model';

export interface IYoutubeVideo {
    image: string,
    videoId: string,
    publishedAt: string,
    title: string,
    duration: string,
}

interface IEvent {
    name: string;
}

interface IEventThumbClick extends IEvent {
    name: 'thumbClick';
    data: IYoutubeVideoModel;
}

export type TVideoEvent = IEventThumbClick;
