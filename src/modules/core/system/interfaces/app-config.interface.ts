import {IIndexing} from './global.interface';
import {IMenu} from './menu.interface';
import {IBanner} from './promo.interface';
import {ILoyalty} from './loyalty.interface';
import {ICategorySettings} from './categories.interface';

export interface IBootstrapMenuItem {
    menuId: string;
    menuName: IIndexing<string>;
}

export interface IBootstrap {
    banners: IIndexing<IBanner[]>;
    categories?: IIndexing<ICategorySettings>;
    country: string;
    country2: string;
    countryLangs: string[];
    countryRestricted: boolean;
    env: TEnv;
    footerText: IIndexing<string>;
    hideEmailExistence: boolean;
    ignoreProvidersForGameCatalog?: boolean;
    language: string;
    locale: string;
    languages: ILanguage[];
    loggedIn: string;
    menu: IBootstrapMenuItem[];
    mobile: boolean;
    mobileApp?: IMobileApp;
    sessionName: string;
    site: string;
    siteconfig: ISiteConfig;
    socialNetworks: ISocialNetwork[];
    useRecaptcha: boolean;
    user: IUser | boolean; // TODO remove after backend delete it
    version: string;
    contacts?: IContacts;
    games?: IGames;
    menuSettings?: IMenu;
    showProfileMenu?: boolean; // TODO Does it need?
}

export type TEnv = 'dev' | 'qa' | 'test' | 'prod';

export interface IContacts {
    email: string;
    emailHref: string;
    phone: string;
    phoneHref: string;
    phones?: IPhone[];
    emails?: IEmail[];
    skype?: string;
    skypeHref?: string;
    additionalFields?: IAdditionalFieldsContacts[];
}

export interface IAdditionalFieldsContacts {
    label: string;
    items: IAdditionalFieldsItem[];
}

export interface IAdditionalFieldsItem {
    anchor: string;
    href: string;
}

export interface IPhone {
    phone: string;
    phoneHref: string;
}

export interface IEmail {
    email: string;
    emailHref: string;
}

export interface IGames {
    enableRestricted: boolean;
}

export interface ILanguage {
    code: string;
    label: string;
}

export interface ICurrency {
    Name: string,
    Alias: string,
    ID?: string | number,
    ExRate?: string,
    registration?: boolean,
}

export type TBooleanOptional = boolean | '' | 0 | 1;

export interface ISiteConfig {
    currencies: IIndexing<ICurrency>;
    depositOnlyFullUserData: string; //TODO Should be number
    exclude_countries: string[];
    fastRegistration: number;
    force_exclude_countries: string; //TODO Should be number
    languages: IIndexing<ISiteconfigLanguage>;
    /**
     * @deprecated use $games.merchantNameAliasesMap
     *
     * Used to rename merchant.
     * Add file to project /../../config/frontend/*.config.json
     *
     * @example
     * {
     *     "siteconfig": {
     *        "merchantNameAliasesMap": {
     *           "bgaming": "Any new name"
     *          }
     *     }
     * }
     *
     * where KEY is merchant.menuId
    **/
    merchantNameAliasesMap?: IIndexing<string>;
    paymentText: IIndexing<string>;
    payment_systems: IPaysystem[];
    /**
     * Generate user password and send on email after registration
     */
    registerGeneratePassword: boolean;
    /**
     * Dont check password on edit profile on first session
     */
    skipPassCheckOnFirstSession?: TBooleanOptional;
    systemsGamePlayInfo: IIndexing<IGamePlayInfo>;
    LastWins?: string;
    RestrictMoneyGames?: number;
    RestrictRegistration?: number;
    // Project type from fundist
    Type: string;
    // Project license from fundist
    License: string;
    // Current version T&C. Set in the backend config
    termsOfService?: string;
}

export interface ISiteconfigLanguage {
    Code?: string;
    ID?: string;
    Name?: string;
    NameEn?: string;
}

export interface IPaysystem {
    Alias: string | IIndexing<string>;
    Init: string;
    Name: string;
}

export interface IGamePlayInfo {
    Fields?: string[];
    Name?: string;
    WalletType?: string;
}

export interface ISocialNetwork {
    id: string;
    name: string;
}

export interface IUser {
    Address: string;
    AddressOfRegistration: string;
    AffiliateClickID: string;
    AffiliateID: string;
    AffiliateSystem: string;
    AlternativePhone: string;
    BankAddress: string;
    BankName: string;
    BonusCode: string;
    BonusID: string;
    BranchCode: string;
    City: string;
    CityOfRegistration: string;
    Comment: string;
    DateOfBirth: string;
    Email: string;
    EmailAgree: string;
    ExtLogin: string;
    Gender: string;
    GiftBundleID: string;
    IDIssueDate: string;
    IDIssuer: string;
    IDNumber: string;
    Iban: string;
    IndexOfRegistration: string;
    LastName: string;
    MiddleName: string;
    Name: string;
    Nick: string;
    Phone: string;
    PhoneVerified: string;
    Pincode: string;
    PlaceOfBirth: string;
    PostalCode: string;
    RegistrationIP: string;
    SmsAgree: string;
    Swift: string;
    Timezone: string;
    additional_fields: string;
    birth_day: string;
    birth_month: string;
    birth_year: string;
    country: string;
    currency: string;
    currencySign: string;
    email: string;
    email_notification: string;
    email_verification_code: string;
    email_verified: string;
    email_verified_datetime: string;
    favoriteGames: boolean[];
    favoriteGamesIds: any[];
    first_name: string;
    fundistBalance: number;
    id: string;
    last_name: string;
    login: string;
    loyalty: ILoyalty;
    new_email: string;
    openPositions: number;
    phone1: string;
    phone2: string;
    phone_verified: string;
    reg_ip: string;
    reg_time: string;
    sex: string;
    sms_notification: string;
    social_fb: string;
    social_gp: string;
    social_ml: string;
    social_ok: string;
    social_tw: string;
    social_vk: string;
    social_ya: string;
    status: string;
    tradingURL: boolean;
    user_id: string;
}

export interface IMobileApp {
    version: string;
}
