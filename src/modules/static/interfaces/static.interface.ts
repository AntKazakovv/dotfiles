import {IIndexing} from 'wlc-engine/interfaces';

export type StaticTextType = 'page' | 'post' | 'tag' | 'category';
export type TextDataType = IPostResponse | ITextObject;

export interface IAcf extends IIndexing<any> {}

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
    _embedded: any;
    code?: string;
}

export interface IStaticRequestConfig {
    type?: StaticTextType;
    slug?: string;
    lang?: string;
}
export interface IRequestUrlStaticText {
    category: string;
    tag: string;
    post: string;
    page: string;
}
export interface ITagStaticText {
    id: number;
    count: number;
    description: string;
    link: string;
    name: string;
    slug: string;
    taxonomy: string;
    meta: any[];
    _links: any[];
}
export interface IStaticParams {
    slug?: string;
    context?: string;
    lang?: string;
    _embed?: string | number;
    _fields?: string;
    fields?: string;
    categories?: string;
}
export interface ICategoryStaticText extends ITagStaticText {
    parent: number;
    acf: IAcf;
}

export interface ITextObject {
    data: IPostResponse;
}
