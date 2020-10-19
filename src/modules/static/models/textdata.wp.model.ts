import {TextDataModel} from './textdata.model';
import {IIndexingAny} from 'wlc-engine/interfaces';

import {get as _get, each as _each} from 'lodash';

export class WpTextData extends TextDataModel {
    protected prepareData(data: any): void {
        console.log(data);
        this.id = _get(data, 'id');
        this.slug = _get(data, 'slug');
        this.date = new Date(_get(data, 'date'));
        this.titleRaw = _get(data, 'title.rendered', '');
        this.htmlRaw = _get(data, 'content.rendered', '');
        this.title = this.getTitle();
        this.html = this.getHtml();
        this.image = _get(data, `_embedded['wp:featuredmedia']['0'].source_url`, '');
        this.extFields = this.getExtFields(data);
    }

    protected getExtFields(data: any): IIndexingAny {
        const res: IIndexingAny = {};
        const fields = this.configService.appConfig.$static?.additionalFields;
        _each(fields, (field) => {
            res[field] = _get(data, field);
        });
        return res;
    }
}
