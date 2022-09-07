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

    /**
     * redirects after application start to a specific state
     */
    redirectAfterLoad?: IRedirectAfterLoad;
}

export interface IRedirect {
    modalInsteadRedirect?: string;
    state?: string;
    params?: IIndexing<any>;
    profile?: profileRedirectType;
}

export interface ISocketsData {
    api: string;
    server: string;
    token: string;
}

export interface IRedirectAfterLoad {
    /**
     * state where will the redirect be made
     * example: 'app.promotions', 'app.tournaments' etc
     */
    state: string;
    /**
     * if the parameter is enabled, then the redirect will occur every time the page is reloaded
     */
    repeatRedirect: boolean;
}

export type TIconColorBg = 'dark' | 'light';
export type TIconShowAs = 'svg' | 'img';
export type TIconsType = 'color' | 'black';
