import {
    AbstractModel,
    IFromLog,
    IBanner,
    GlobalHelper,
} from 'wlc-engine/modules/core';

import _filter from 'lodash-es/filter';
import _map from 'lodash-es/map';
import _assign from 'lodash-es/assign';

export class BannerModel extends AbstractModel<IBanner>{
    public geo: string[];

    constructor(
        from: IFromLog,
        data: IBanner,
    ) {
        super({from: _assign({model: 'BannerModel'}, from)});
        this.data = {
            ...data,
            tags: _filter(data.tags, (tag) => !tag.includes('geo:')),
        };
        this.geo = _map(_filter(data.tags, (tag) => tag.includes('geo:')), (tag) => tag.split(':')[1]);
    }

    public get html(): string {
        return GlobalHelper.proxyLinks(this.data.html);
    }

    public get platform(): string[] {
        return this.data.platform;
    }

    public get visibility(): string[] {
        return this.data.visibility;
    }

    public get tags(): string[] {
        return this.data.tags;
    }
}
