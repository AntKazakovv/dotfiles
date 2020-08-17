import {get as _get, isBoolean as _isBoolean} from 'lodash';
import {IIndexAny, TextDataModel} from './textdata.model';

export interface ICacheWpResponce {
    id: number;
    date: string;
    slug: string;
    titleRaw: string;
    htmlRaw: string;
    image: string;
    extFields?: IIndexAny;
}

export class CacheTextData extends TextDataModel {

    protected prepareData(data: ICacheWpResponce): void {
        this.id = data.id;
        this.slug = data.slug;
        this.date = new Date(data.date);
        this.titleRaw = data.titleRaw;
        this.htmlRaw = data.htmlRaw;

        this.image = _isBoolean(data.image) ? '' : data.image;
        this.extFields = _get(data, 'extFields', {});

        this.title = this.getTitle();

        this.html = this.getHtml();
    }
}
