// export interface IAppConfig {
//     banners: IBanners;
//     contacts: IContacts;
//     country: string;
//     country2: string;
//     countryLangs: string[];
//     countryRestricted: boolean;
//     env: string;
//     footerText: IIndexingString;
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

export class AppConfigModel {
    $base: any;
    $layouts: any;
    $static: any;
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
    languages: any[];
    loggedIn: string;
    menu: any[];
    mobile: boolean;
    seo: any[];
    sessionName: string;
    showProfileMenu: boolean;
    site: string;
    siteconfig: any;
    socialNetworks: any[];
    sportsbook: any;
    user: any;
    version: string;
    apiBaseUrl: string;

    constructor(data: any) {
        Object.assign(this, data);
    }
}
