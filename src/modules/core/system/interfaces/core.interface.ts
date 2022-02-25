import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export interface ICoreConfig {
}

export type profileRedirectType = 'default' | 'first';

export interface IRedirectConfig {
    /**
     * redirect by registration complete
     */
    registration?: IRedirect;
    /**
     * redirect on zero balance on enter game play
     */
    zeroBalance?: IRedirect;
    /**
     * redirect by state name
     */
    states?: IIndexing<IRedirect>;
    profileRedirects?: IIndexing<profileRedirectType>;
}

export interface IRedirect {
    state: string;
    params?: IIndexing<any>;
    profile?: profileRedirectType;
}

export interface ISocketsData {
    api: string;
    server: string;
    token: string;
}

export type TIconColorBg = 'dark' | 'light';
export type TIconShowAs = 'svg' | 'img';
export type TIconsType = 'color' | 'black';
