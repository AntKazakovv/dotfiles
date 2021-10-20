import {
    IIndexing,
    ILoyalty,
    IFreeRound,
    ISocketsData,
} from './index';

export interface IUserInfo {
    LockExpiresAt?: string;
    affiliateID?: string;
    availableWithdraw: number;
    balance: number;
    category: string;
    email: string;
    emailHash: string;
    firstName: string;
    idUser: string;
    lastName: string;
    loyalty: ILoyalty;
    pincode: string;
    status: number;
    socketsData?: ISocketsData,
    freerounds: IFreeRound[];
}

export interface IUserProfile {
    address?: string;
    bankName?: string;
    bankNameText?: string;
    birthDay?: string;
    birthMonth?: string;
    birthYear?: string;
    branchCode?: string;
    city?: string;
    countryCode?: string;
    currency?: string;
    currentPassword?: string;
    email?: string;
    emailVerified?: string;
    extProfile?: IExtProfile;
    emailAgree?: boolean;
    firstName?: string;
    gender?: string;
    ibanNumber?: string;
    idNumber?: string;
    idUser?: string;
    lastName?: string;
    login?: string;
    newEmail?: string;
    phoneAltCode?: string;
    phoneAltNumber?: string;
    phoneCode?: string;
    phoneNumber?: number | string;
    phoneVerified?: string | boolean;
    postalCode?: string;
    registrationBonus?: string;
    smsAgree?: boolean;
    swift?: string;
    VerificationJobID?: string;
    VerificationSessionID?: string;
    birthDate?: string;
    newPassword?: string;
    newPasswordRepeat?: string;
    passwordRepeat?: string;
    password?: string;
    oddsStyle?: string;
    socketsData?: ISocketsData;
}

export interface IExtProfile {
    /** @deprecated use IUserProfile.emailAgree */
    dontSendEmail?: boolean;
    /** @deprecated use IUserProfile.smsAgree */
    dontSendSms?: boolean;
    /** @deprecated use IUserProfile.emailAgree */
    sendEmail?: boolean;
    /** @deprecated use IUserProfile.smsAgree */
    sendSMS?: boolean;
    paymentSystems?: IExtProfilePaymentSystems;
    realityCheckTime?: string;
    colorTheme?: string;
    pep?: string;
}

export interface IExtProfilePaymentSystems {
    [key: string]: IExtPaymentSystem
}

export interface IExtPaymentSystem {
    additionalParams?: IIndexing<string>;
}
