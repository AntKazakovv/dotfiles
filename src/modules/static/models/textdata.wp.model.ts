import {TextDataModel} from './textdata.model';
import {IIndexing} from 'wlc-engine/interfaces';

import {get as _get, each as _each} from 'lodash';

export class WpTextData extends TextDataModel {
    protected prepareData(data: any): void {
        this.id = _get(data, 'id');
        this.slug = _get(data, 'slug');
        this.date = new Date(_get(data, 'date'));
        this.titleRaw = _get(data, 'title.rendered', '');
        this.htmlRaw = _get(data, 'content.rendered', '');
        this.title = this.getTitle();
        this.html = this.getHtml();
        this.image = _get(data, '_embedded["wp:featuredmedia"]["0"].source_url', '');
        this.extFields = this.getExtFields(data);
    }

    protected getExtFields(data: any): IIndexing<any> {
        const res: IIndexing<any> = {};
        const fields = this.configService.get<IIndexing<string>>('appConfig.$static.additionalFields');
        _each(fields, (field) => {
            res[field] = _get(data, field);
        });
        return res;
    }
}
