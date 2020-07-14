export interface IAcf {
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

export type StaticTextType = 'page' | 'post';

export interface IStaticRequestParams {
    type: StaticTextType;
    slug?: string;
    lang?: string;
}
