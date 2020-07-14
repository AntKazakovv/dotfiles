import {
    get as _get,
    each as _each
} from 'lodash';

export interface ITextObject {
    data: any;
}

export interface IIndexAny {
    [key: string]: any;
}

export abstract class TextDataModel {
    public id: number;
    public date: Date;
    public slug: string;
    public htmlRaw: string;
    public titleRaw: string;
    public image: string;
    public introText: string;
    public extFields?: IIndexAny;

    protected pattern = /^\((.*)\)\s/;

    protected cacheFields: string[] = ['id', 'date', 'slug', 'titleRaw', 'htmlRaw', 'image', 'extFields'];

    constructor(
        dataObject: ITextObject,
    ) {
        this.prepareData(dataObject.data);
        this.introText = this.getIntroText();
    }

    public toJSON(): IIndexAny {
        const res: IIndexAny = {};
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
            // const elem = angular.element(`<div>${this.htmlRaw}</div>`);
            // if (elem.children()[0]) {
            //     return elem[0].outerHTML;
            // } else {
            //     return elem.text().split(' ').slice(0, 50).join(' ') + '...';
            // }
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
        const elem = document.createElement('pre');
        elem.innerHTML = text.replace(/</g, '&lt;');
        return elem.innerText || elem.textContent || '';
    }

}
