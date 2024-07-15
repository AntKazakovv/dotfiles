import {IWSWalletObj} from 'wlc-engine/modules/multi-wallet';

/**
 * `POST /api/v1/userPassword` body params
 * @param email - user email which is bound to account
 * @param phone - user phone (without country code) which is bound to account
 * @param sendSmsCode - must be `1` if param `phone` is used
 * @param reCaptchaToken - if captcha is used - send this field
 */
export interface IUserPasswordPost {
    email?: string;
    phone?: string;
    sendSmsCode?: number;
    reCaptchaToken?: string;
}

export interface ILogoutConfirm {
    modalMessage?: string;
}

export interface IEmailVerifyData {
    code: string;
    password?: string;
}

export interface ILoginWithPhoneData {
    phoneCode: string;
    phoneNumber: string;
    password: string;
}

export interface IWSDataUserBalance {
    Balance: number | string;
    BonusBalance: number;
    IDUser: string;
    Login: string;
    Currency?: string;
    ParentCurrency?: string;
    IDParent?: number;
    IsWallet?: number;
    timestamp?: string;
    timestamp_ms?: number;
    dwh_event_id?: string;
    odb_event_id?: number;
    Node?: number;
    GameActionID?: number;
    Wallets?: IWSWalletObj;
    availableWithdraw?: string;
}

export interface IUserNickIcon {
    nick: string,
    icon: string,
};

export const ProfileUpdateTypes: Record<string, string> = {
    CHANGE_WALLET: 'changeWallet',
} as const;

export interface IWSUserInfoPayload {
    RefreshWallet?: string;
    method: string;
}
