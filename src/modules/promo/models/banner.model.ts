import {IBanner} from 'wlc-engine/interfaces';
import {
    filter as _filter,
    map as _map,
    isObject as _isObject,
    assign as _assign,
} from 'lodash';

export class BannerModel {
    public readonly html: string;
    public readonly platform: string[];
    public readonly visibility: string[];
    public tags: string[];
    public geo: string[];
    public type: string;

    constructor(data: IBanner) {
        _assign(this, data);

        this.geo = _map( _filter(this.tags, (tag) => tag.includes('geo:')), (tag) => tag.split(':')[1]);
        this.tags = _filter(this.tags, (tag) => !tag.includes('geo:'));
    }

    public getHtml(): string {

        const html = new DOMParser()
            .parseFromString(this.html, 'text/html');

        return html.querySelector('.swiper-slide')
            ? this.html
            : `<div class="swiper-slide">${this.html}</div>`;
    }
}
