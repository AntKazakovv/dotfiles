import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import _assign from 'lodash-es/assign';

import {
    AbstractModel,
    IFromLog,
} from 'wlc-engine/modules/core';

import {IYoutubeVideo} from 'wlc-engine/modules/youtube-block/system/interfaces/youtube-block.interface';

export class IYoutubeVideoModel extends AbstractModel<IYoutubeVideo> {

    constructor(
        private readonly _data: IYoutubeVideo,
        from: IFromLog,
    ){
        super({from: _assign({model: 'YoutubeVideoModel'}, from)});
    }

    public get image(): typeof this._data.image {
        return this._data.image;
    }

    public get videoId(): typeof this._data.videoId {
        return this._data.videoId;
    }

    public get title(): typeof this._data.title {
        return this._data.title;
    }

    public get duration(): typeof this._data.duration {
        dayjs.extend(duration);
        return dayjs.duration(this._data.duration).format('HH:mm:ss').replace(/\d{0,2}\:/, '').toString();
    }
}
