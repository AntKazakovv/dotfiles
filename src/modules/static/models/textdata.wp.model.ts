import {modelDecorator} from 'src/core/decorators/model-decorator';
import {TextDataModel, modelInject, IIndexAny} from './textdata.model';

import {get as _get, each as _each} from 'lodash';

@modelDecorator({
    inject: modelInject,
})
export class WpTextData extends TextDataModel {
    protected prepareData(data: any): void {
        this.id = _get(data, '0.id');
        this.slug = _get(data, '0.slug');
        this.date = new Date(_get(data, '0.date'));

        this.titleRaw = _get(data, '0.title.rendered', '');
        this.htmlRaw = _get(data, '0.content.rendered', '');

        this.title = this.getTitle();

        if (this.$scope && this.$compile) {
            this.compileHtml(this.$scope);
        } else {
            this.html = this.getHtml();
        }

        this.image = _get(data, `0._embedded['wp:featuredmedia']['0'].source_url`, '');
        this.extFields = this.getExtFields(data);
    }

    protected getExtFields(data: any): IIndexAny {
        const res: IIndexAny = {};
        const fields = _get(this.appConfig, 'siteconfig.wordpress.additionalFields');
        _each(fields, (field) => {
            res[field] = _get(data, `0.${field}`);
        });
        return res;
    }
}
