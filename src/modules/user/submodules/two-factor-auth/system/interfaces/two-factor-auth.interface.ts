export interface ITwoFactorAuthResponse {
    path: string;
    secret: string;
}

export interface ITwoFactorEnterCodeData {
    authKey: string;
    code2FA: string;
}
