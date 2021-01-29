import {TextDataModel} from './textdata.model';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

import {
    get as _get,
    isBoolean as _isBoolean,
} from 'lodash-es';

export interface IWlcWpResponse {
    id: number;
    date: string;
    slug: string;
    title: string;
    content: string;
    image: string | boolean;
    extFields?: IIndexing<any>;
}

export class WlcTextData extends TextDataModel {

    protected prepareData(data: IWlcWpResponse): void {
        this.id = data.id;
        this.slug = data.slug;
        this.date = new Date(data.date);
        this.titleRaw = data.title;
        this.htmlRaw = data.content;
        this.image = _isBoolean(data.image) ? '' : data.image;
        this.extFields = _get(data, 'extFields', {});
        this.title = this.getTitle();
        this.html = this.getHtml();
    }
}
