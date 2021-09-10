import {
    IMenu,
    IMenuItem,
} from './menu.interface';
import {IIndexing} from './global.interface';
import {IBanner} from './promo.interface';
import {ILoyalty} from './loyalty.interface';

export interface IBootstrap {
    banners: IIndexing<IBanner>;
    country: string;
    country2: string;
    countryLangs: string[];
    countryRestricted: boolean;
    env: TEnv;
    footerText: IIndexing<string>;
    hideEmailExistence: boolean;
    ignoreProvidersForGameCatalog?: boolean;
    language: string;
    languages: ILanguage[];
    loggedIn: string;
    menu: IMenuItem[];
    mobile: boolean;
    // seo: any[]; // TODO Check when project with SEO appears
    sessionName: string;
    site: string;
    siteconfig: ISiteConfig;
    socialNetworks: ISocialNetwork[];
    user: IUser | boolean; // TODO remove after backend delete it
    version: string;
    contacts?: IContacts;
    games?: IGames;
    menuSettings?: IMenu;
    showProfileMenu?: boolean; // TODO Does it need?
}

export type TEnv = 'dev' | 'test' | 'prod';

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

export interface ISiteConfig {
    currencies: IIndexing<ICurrency>;
    depositOnlyFullUserData: string; //TODO Should be number
    exclude_countries: string[];
    fastRegistration: number;
    force_exclude_countries: string; //TODO Should be number
    languages: IIndexing<ISiteconfigLanguage>;
    paymentText: IIndexing<string>;
    payment_systems: IPaysystem[];
    registerGeneratePassword: boolean;
    systemsGamePlayInfo: IIndexing<IGamePlayInfo>;
    LastWins?: string;
    RestrictMoneyGames?: number;
    RestrictRegistration?: number;
    Type?: string;
}

export interface ISiteconfigLanguage {
    Code?: string;
    ID?: string;
    Name?: string;
    NameEn?: string;
}

export interface IPaysystem {
    Alias: IIndexing<string>;
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
