import {IIndexing} from 'wlc-engine/modules/core';

export type StaticTextType = 'page' | 'post' | 'tag' | 'category';
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

    /**
     * Show promo posts on default language
     * if the content not available for the select language.
     *
     * 1) Posts for the default language are requested only if the config is enabled;
     * in all other cases, default behavior.
     *
     * 2) In the WP language settings (Settings -> Language) the following items must be enabled
     *
     * 2.1) Hide posts which content is not available for the selected language
     *
     * 2.2) Show menu items in an alternative language when translators is not available for the selected language
     *
     * 2.3) Show post content in an alternative language when translation is not available for the selected language
     *
     * 2.4) Show displayed language prefix when field content is not available for the selected language
     *
     * 3) In the language settings (Default Language / Orders),
     * the desired language must be selected as the default, and must also be at the very top in order.
     *
     * 4) If the default language is different from English, then in the static.config.ts property
     * $static.wpPromoShowAllPosts.defaultLanguage
     * the default language from the WP must be specified (for example defaultLanguage: 'ru')
     *
     */
    wpPromoShowAllPosts?: {
        use: boolean;

        /**
         * Default language from from WP Language settings. Setup default lang first in order wp settings.
         *
         * Default: 'en'
         */
        defaultLanguage: string;
    }
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
    author?: number;
    categories?: number[];
    comment_status?: string;
    content: {
        protected: boolean;
        rendered: string;
    };
    date: string;
    date_gmt?: string;
    excerpt?: {
        protected: boolean;
        rendered: string;
    };
    featured_media?: number;
    format?: string;
    guid?: {
        rendered: string;
    };
    id: number;
    link?: number;
    meta?: any[];
    modified?: string;
    modified_gmt?: string;
    ping_statis?: string;
    slug: string;
    status?: string;
    sticky?: boolean;
    tags?: any[];
    template?: string;
    title: {
        rendered: string;
    };
    type?: string;
    image?: string;
    acf?: IAcf;
    _embedded?: any;
    code?: string;
}

export interface IStaticRequestConfig {
    type?: StaticTextType;
    slug?: string;
    lang?: string;
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
