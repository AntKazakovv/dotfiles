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
