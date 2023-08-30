import {Injectable} from '@angular/core';

import _map from 'lodash-es/map';

import {
    DataService,
    IData,
    LogService,
} from 'wlc-engine/modules/core';
import {IYoutubeVideoModel} from 'wlc-engine/modules/youtube-block/system/models/youtube-block.model';
import {IYoutubeVideo} from 'wlc-engine/modules/youtube-block/system/interfaces/youtube-block.interface';

@Injectable()
export class YoutubeBlockService {

    constructor(
        private readonly _dataService: DataService,
        protected logService: LogService,
    ) {
    }

    public async getYoutubeVideos(): Promise<IYoutubeVideoModel[]> | never {
        try {
            const result = await this._dataService.request<IData<IYoutubeVideo>>({
                name: 'youtube',
                system: 'youtube',
                url: '/youtube',
                type: 'GET',
                cache: 60000,
            });
            return this.modifyData(result.data);
        } catch (error) {
            this.logService.sendLog({
                code: '7.0.1', // Error - empty data
                flog: {
                    error,
                },
            });
        }
    }

    protected modifyData(data: IYoutubeVideo[]): IYoutubeVideoModel[] {
        return _map(data, item => new IYoutubeVideoModel(
            item,
            {
                service: 'YoutubeBlockService',
                method: 'modifyData',
            },
        ));
    }
}
