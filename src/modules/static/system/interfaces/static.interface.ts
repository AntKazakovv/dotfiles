import {IIndexing} from 'wlc-engine/modules/core';

export type StaticTextType = 'page' | 'post';
export type TWpTranslateMode = 'query' | 'pre-path';
export interface IAcf extends IIndexing<any> {}

export interface IStaticConfig {
    pages?: string[],
    wpPlugins?: {
        /**
         * Changing url formation for translation links
         */
        translateMode?: TWpTranslateMode;
    },
    cacheExpiry?: ICacheExpiry,
    additionalFields?: string[],
    normalizeInternalLinks?: boolean,
    rewritingLanguages?: IIndexing<string>,
    /** `splitStaticTexts` settings for split static texts */
    splitStaticTexts?: ISplitTexts;
    downloadPdf?: IDownloadPdf;
}

export interface IDownloadPdf {
    slugsAvailableForDownload?: string[];
    /** By default, the button is displayed on wlc + curacao.
    * This option allows you to enable the button on demand on any project
    */
    forceShowButton?: boolean;
}

export interface ICacheExpiry {
    category: number,
    post: number,
    tag: number,
    page: number,
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
    _embedded: any;
    code?: string;
}

export interface IRequestUrlStaticText {
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

export interface ICategoryStaticText {
    parent: number;
    name: string;
    id: number;
    slug: string;
    count: number;
    description?: string;
    acf?: IAcf;
}

export interface ISplitTexts {
    /** `useByDefault` add lang postfix to all static page's slugs */
    useByDefault?: boolean;
    /** `slugs` add lang postfix to special pages */
    slugs?: string[],
}

/** Request params to convert to PDF endpoint */
export interface IPDFParams {
    /** language of post */
    lang: string;
    /** page/post slug in WP */
    slug: string;
    /**
     * Service version
     */
    termsOfService: string;
    /** set to prepath when prepath mode in WP enabled */
    mode?: 'prepath' | 'query';
    /** type of content */
    pageType?: 'page' | 'post';
}

export interface IMainParamsTextData {
    slug: string;
    lang?: string;
}
