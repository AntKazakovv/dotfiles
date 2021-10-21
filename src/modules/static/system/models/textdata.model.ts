import {
    ConfigService,
    AbstractModel,
    IFromLog,
} from 'wlc-engine/modules/core';
import {IPostResponse} from 'wlc-engine/modules/static';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

import _get from 'lodash-es/get';
import _each from 'lodash-es/each';
import _toNumber from 'lodash-es/toNumber';
import _assign from 'lodash-es/assign';

export interface ITextData {
    id: number;
    date: Date;
    slug: string;
    htmlRaw: string;
    html: string;
    titleRaw: string;
    title: string;
    image: string;
    introText: string;
    extFields?: IIndexing<any>;
    pattern: RegExp;
    cacheFields: string[];
}

export abstract class TextDataModel extends AbstractModel<ITextData>{
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

    protected pattern: RegExp = /^\((.*)\)\s/;

    protected cacheFields: string[] = ['id', 'date', 'slug', 'titleRaw', 'htmlRaw', 'image', 'extFields'];

    constructor(
        from: IFromLog,
        protected dataObject: IPostResponse,
        protected configService: ConfigService,
    ) {
        super({from: _assign({model: 'TextDataModel'}, from)});
        this.prepareData(dataObject);
        this.introText = this.getIntroText();
    }

    /**
     * Return outer link value of the post
     */
    public get outerLink(): string {
        return this.extFields?.acf?.outer_link;
    }

    /**
     * Return sort weight value of the post
     */
    public get sortOrder(): number {
        return _toNumber(this.extFields?.acf?.sort_weight) ?? 0;
    }

    /**
     * Get self cache fields
     * 
     * @returns {IIndexing<any>} - key and values cache fields
     */
    public getCacheFields(): IIndexing<any> {
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
            return this.decodeHtml(split[0]).replace(/<*.>?$/, '');
        } else {
            return this.decodeHtml(split[0]).replace(/<*.>?$/, '').split(' ').slice(0, 50).join(' ') + '...';
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
        return text;
    }

    protected decodeHtml(text: string): string {
        return text;
    }
}
