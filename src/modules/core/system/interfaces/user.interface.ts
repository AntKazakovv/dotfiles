import {TColorTheme} from 'wlc-engine/modules/core/system/interfaces/base-config/color-theme-switching.config';
import {
    ICurrencyFilter,
    ISelectedWallet,
    IWalletObj,
    IWalletsSettings,
} from 'wlc-engine/modules/multi-wallet/system/interfaces/wallet.interface';

import {
    IIndexing,
    ILoyalty,
    IFreeRound,
} from './index';
import {IWebSocketConfig} from './websocket.interface';

export type TUserValidationLevel = 'not-secure' | 'secure';

export type TSQLDate = string;

/** @deprecated string value */
export type PepStatusAsString = 'true' | 'false';

export type PepStatus = PepStatusAsString | boolean;

export interface IUserInfo {
    LockExpiresAt?: string;
    affiliateID?: string;
    availableWithdraw: number;
    balance: number;
    blockByLocation: boolean;
    category: string;
    email: string;
    emailHash: string;
    firstName: string;
    idUser: string;
    lastName: string;
    loyalty: ILoyalty;
    pincode: string;
    /**
     * Is user session first
     */
    firstSession: boolean;
    status: number;
    socketsData?: IWebSocketConfig | '',
    freerounds: IFreeRound[];
    validationLevel?: TUserValidationLevel;
    /** Info about last accepted T&C */
    toSVersion: {
        /** Accepting T&C date */
        AcceptDateTime: TSQLDate;
        /** Version of last accepted T&C */
        ToSVersion: TSQLDate | null;
    };
    /** Need to accept version of T&C */
    toSWlcVersion: TSQLDate;
    transfersAllowed: boolean;
    /*Tags*/
    Tags?: IIndexing<string>;
    wallets?: IWalletObj;
    enabled2FAGoogle?: boolean;
    notify2FAGoogle?: boolean;
    ageConfirmed?: boolean;
    agreeWithSelfExcluded?: boolean;
    agreedWithTermsAndConditions?: boolean;
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
    cpf?: string;
    stateCode?: string;
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
    socketsData?: IWebSocketConfig | '';
    /**
     * User type
     */
    type?: TUserType;
    /** Metamask wallet address */
    walletAddress?: string;
    /** Signature message */
    message?: string;
    /** Metamask signature */
    signature?: string;
    skipEmailVerification?: boolean;
    ageConfirmed?: boolean;
    agreeWithSelfExcluded?: boolean;
    agreedWithTermsAndConditions?: boolean;
}

export type TUserType = 'metamask' | 'default';

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
    colorTheme?: TColorTheme;
    pep?: PepStatus;
    nick?: string;
    currentWallet?: ISelectedWallet;
    /** Сurrency into which all amounts will be converted */
    conversionCurrency?: IWalletsSettings;
    /** Currencies not showing in wallet selector*/
    unusedCurrencies?: ICurrencyFilter[];
}

export interface IExtProfilePaymentSystems {
    [key: string]: IExtPaymentSystem
}

export interface IExtPaymentSystem {
    additionalParams?: IIndexing<string>;
}
