import {ConfigService} from 'wlc-engine/modules/core';
import {IPostResponse} from 'wlc-engine/modules/static';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

import {
    get as _get,
    each as _each,
    toNumber as _toNumber,
} from 'lodash-es';

export abstract class TextDataModel {
    public id: number;
    public date: Date;
    public slug: string;
    public htmlRaw: string;
    public html: string;
    public titleRaw: string;
    public title: string;
    public image: string;
    public introText: string;
    public extFields?: IIndexing<any>;

    protected pattern = /^\((.*)\)\s/;

    protected cacheFields: string[] = ['id', 'date', 'slug', 'titleRaw', 'htmlRaw', 'image', 'extFields'];

    constructor(
        protected dataObject: IPostResponse,
        protected configService: ConfigService,
    ) {
        this.prepareData(dataObject);
        this.introText = this.getIntroText();
    }

    public get outerLink(): string {
        return this.extFields?.acf?.outer_link;
    }

    public get sortOrder(): number {
        return _toNumber(this.extFields?.acf?.sort_weight) ?? 0;
    }

    public toJSON(): IIndexing<any> {
        const res: IIndexing<any> = {};
        _each(this.cacheFields, (field) => {
            res[field] = _get(this, field);
        });
        return res;
    }

    protected abstract prepareData(data: any): void;

    protected getIntroText(): string {
        const split = this.htmlRaw.split('<!--more-->');
        if (split.length > 1) {
            return this.decodeHtml(split[0]).replace(/\<*.\>?$/, '');
        } else {
            return this.decodeHtml(split[0]).replace(/\<*.\>?$/, '').split(' ').slice(0, 50).join(' ') + '...';
        }
    }

    protected getTitle(): string {
        return this.filterHtml(this.titleRaw.replace(this.pattern, ''));
    }

    protected getHtml(): string {
        try {
            return this.decodeHtml(this.htmlRaw).replace(/”/gi, '\"');
        } catch (error) {
            return '<div>' + this.decodeHtml(this.htmlRaw).replace(/”/gi, '\"') + '</div>';
        }
    }

    protected filterHtml(text: string): string {
        // return this.$sce.trustAsHtml(_isString(text) ? this.decodeHtml(text) : text);
        return text;
    }

    protected decodeHtml(text: string): string {
        return text;
        // const elem = this.document.createElement('pre');
        // elem.innerHTML = text.replace(/</g, '&lt;');
        // return elem.innerText || elem.textContent || '';
    }
}
