import {modelDecorator} from 'src/core/decorators/model-decorator';
import {TextDataModel, modelInject, IIndexAny} from './textdata.model';

import {get as _get, isBoolean as _isBoolean} from 'lodash';

export interface IWlcWpResponce {
    id: number;
    date: string;
    slug: string;
    title: string;
    content: string;
    image: string | boolean;
    extFields?: IIndexAny;
}

@modelDecorator({
    inject: modelInject,
})
export class WlcTextData extends TextDataModel {

    protected prepareData(data: IWlcWpResponce): void {
        this.id = data.id;
        this.slug = data.slug;
        this.date = new Date(data.date);
        this.titleRaw = data.title;
        this.htmlRaw = data.content;

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
