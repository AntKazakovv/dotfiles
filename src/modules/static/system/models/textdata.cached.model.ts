import {TextDataModel} from './textdata.model';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export interface ICachedWpResponse {
    id: number;
    date: string;
    slug: string;
    titleRaw: string;
    htmlRaw: string;
    image: string;
    extFields?: IIndexing<any>;
}

export class CachedTextData extends TextDataModel {
    protected prepareData(data: ICachedWpResponse): void {
        this.id = data.id;
        this.date = new Date(data.date);
        this.slug = data.slug;
        this.titleRaw = data.titleRaw || '';
        this.htmlRaw = data.htmlRaw || '';
        this.image = data.image || '';
        this.extFields = data.extFields || {};
        this.title = this.getTitle();
        this.html = this.getHtml();
    }
}
