import moment from 'moment';

import {get as _get} from 'lodash';

interface IAcf {
    [key: string]: any;
}

export interface IPostResponse {
    author: number;
    categories: number[];
    comment_status: string;
    content: {
        protected: boolean;
        rendered: string;
    };
    date: string;
    date_gmt: string;
    excerpt: {
        protected: boolean;
        rendered: string;
    };
    featured_media: number;
    format: string;
    guid: {
        rendered: string;
    };
    id: number;
    link: number;
    meta: any[];
    modified: string;
    modified_gmt: string;
    ping_statis: string;
    slug: string;
    status: string;
    sticky: boolean;
    tags: any[];
    template: string;
    title: {
        rendered: string;
    };
    type: string;
    image: string;
    acf?: IAcf;
}

export class PostModel {
    public readonly slug: string;
    public readonly categories: number[];
    public readonly content: string;
    public readonly date: moment.Moment;
    public readonly title: string;
    public readonly image: string;
    public readonly description: string;
    public readonly acf: IAcf;

    constructor(post: IPostResponse) {
        this.slug = post.slug;
        this.categories = post.categories;
        this.content = post.content.rendered;
        this.date = (window as any).moment(post.date);
        this.title = post.title.rendered;
        this.image = post.image;
        this.description = post.excerpt.rendered;
        this.acf = _get(post, 'acf');
    }

    public getIntroText(limit = 120) {
        return this.description.substr(0, limit) + ((this.description.length > limit) ? '...' : '');
    }
}
