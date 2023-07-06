export interface ITwoFactorAuthResponse {
    path: string;
    secret: string;
}

export interface ITwoFactorAuthUserInfo {
    enabled2FAGoogle: boolean;
    notify2FAGoogle: boolean;
}
