import {modelDecorator} from 'src/core/decorators/model-decorator';
import {TextDataModel, modelInject, IIndexAny} from './textdata.model';

import {get as _get, isBoolean as _isBoolean} from 'lodash';

export interface ICacheWpResponce {
    id: number;
    date: string;
    slug: string;
    titleRaw: string;
    htmlRaw: string;
    image: string;
    extFields?: IIndexAny;
}

@modelDecorator({
    inject: modelInject,
})
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

        if (this.$scope && this.$compile) {
            this.compileHtml(this.$scope);
        } else {
            this.html = this.getHtml();
        }
    }
}
