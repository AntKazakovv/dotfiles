import {isString as _isString, get as _get, each as _each} from 'lodash';
import {IScope, ICompileService, ISCEService} from 'angular';
import {IAppConfig} from 'src/core/interfaces/appConfig';
export const modelInject = ['$sce', '$compile', 'appConfig'];

export interface ITextObject {
    data: any;
    $scope?: IScope;
}

export interface IIndexAny {
    [key: string]: any;
}

export abstract class TextDataModel {
    public id: number;
    public date: Date;
    public slug: string;
    public title: string;
    public html: JQLite;
    public htmlRaw: string;
    public titleRaw: string;
    public image: string;
    public introText: string;
    public extFields?: IIndexAny;

    protected pattern = /^\((.*)\)\s/;
    protected $scope: IScope;

    protected cacheFields: string[] = ['id', 'date', 'slug', 'titleRaw', 'htmlRaw', 'image', 'extFields'];

    constructor(
        dataObject: ITextObject,
        protected $sce?: ISCEService,
        protected $compile?: ICompileService,
        protected appConfig?: IAppConfig,
    ) {
        this.$scope = dataObject.$scope;
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

    public compileHtml($scope: IScope): void {
        this.$scope = $scope;
        this.html = this.$compile(this.getHtml())(this.$scope);
    }

    protected abstract prepareData(data: any): void;

    protected getIntroText(): string {
        const split = this.htmlRaw.split('<!--more-->');
        if (split.length > 1) {
            return this.decodeHtml(split[0]).replace(/\<*.\>?$/, '');
        } else {
            const elem = angular.element(`<div>${this.htmlRaw}</div>`);
            if (elem.children()[0]) {
                return elem[0].outerHTML;
            } else {
                return elem.text().split(' ').slice(0, 50).join(' ') + '...';
            }
        }
    }

    protected getTitle(): string {
        return this.filterHtml(this.titleRaw.replace(this.pattern, ''));
    }

    protected getHtml(): JQLite {
        try {
            return angular.element(this.decodeHtml(this.htmlRaw).replace(/”/gi, '\"'));
        } catch (error) {
            return angular.element('<div>' + this.decodeHtml(this.htmlRaw).replace(/”/gi, '\"') + '</div>');
        }
    }

    protected filterHtml(text: string): string {
        return this.$sce.trustAsHtml(_isString(text) ? this.decodeHtml(text) : text);
    }

    protected decodeHtml(text: string): string {
        const elem = document.createElement('pre');
        elem.innerHTML = text.replace(/</g, '&lt;');
        return elem.innerText || elem.textContent || '';
    }

}
