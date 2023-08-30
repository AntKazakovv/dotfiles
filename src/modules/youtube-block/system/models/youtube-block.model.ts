import _assign from 'lodash-es/assign';

import {
    AbstractModel,
    IFromLog,
} from 'wlc-engine/modules/core';

import {
    Duration,
} from 'luxon';

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
        const durationAsObj = Duration.fromISO(this._data.duration).toObject();
        // eslint-disable-next-line max-len
        return Duration.fromObject(durationAsObj).toISOTime({suppressMilliseconds: true}).replace(/\d{0,2}\:/, '').toString();
    }
}
