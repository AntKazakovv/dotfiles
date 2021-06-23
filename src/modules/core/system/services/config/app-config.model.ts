// export interface IAppConfig {
//     banners: IBanners;
//     contacts: IContacts;
//     country: string;
//     country2: string;
//     countryLangs: string[];
//     countryRestricted: boolean;
//     env: string;
//     footerText: IIndexing<string>;
//     games: IGames;
//     ignoreProvidersForGameCatalog: boolean;
//     language: string;
//     languages: ILanguage[];
//     loggedIn: string;
//     menu: IMenuItem[];
//     mobile: boolean;
//     seo: any[];
//     sessionName: string;
//     showProfileMenu: boolean;
//     site: string;
//     siteconfig: ISiteConfig;
//     socialNetworks: ISocialNetwork[];
//     sportsbook: ISportsBook;
//     user: IUser;
//     version: string;
//     apiBaseUrl: string;
// }

import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export interface ILanguage {
    code: string;
    label: string;
}

export interface IPaysystem {
    Alias: IIndexing<string>;
    Init: string;
    Name: string;
}

export class AppConfigModel {
    banners: any;
    contacts: any;
    country: string;
    country2: string;
    countryLangs: string[];
    countryRestricted: boolean;
    env: string;
    footerText: any;
    games: any;
    ignoreProvidersForGameCatalog: boolean;
    language: string;
    languages: ILanguage[];
    loggedIn: string;
    menu: any[];
    mobile: boolean;
    seo: any[];
    sessionName: string;
    showProfileMenu: boolean;
    site: string;
    siteconfig: {
        payment_systems: IPaysystem[];
        [key: string]: any;
    };
    socialNetworks: any[];
    sportsbook: any;
    user: any;
    version: string;
    apiBaseUrl: string;

    constructor(data: any) {
        Object.assign(this, data);
    }
}
