import {IBanner} from 'wlc-engine/modules/core/system/interfaces';

import _filter from 'lodash-es/filter';
import _map from 'lodash-es/map';
import _assign from 'lodash-es/assign';

export class BannerModel {
    public readonly html: string;
    public readonly platform: string[];
    public readonly visibility: string[];
    public tags: string[];
    public geo: string[];
    public type: string;

    constructor(data: IBanner) {
        _assign(this, data);

        this.geo = _map(_filter(this.tags, (tag) => tag.includes('geo:')), (tag) => tag.split(':')[1]);
        this.tags = _filter(this.tags, (tag) => !tag.includes('geo:'));
    }

    public getHtml(): string {

        return this.html;
    }
}
