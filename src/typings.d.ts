declare function require(path: string): {
    [key: string]: any;
    default: string;
};
declare function gettext<T>(str: T): T;

declare interface ISentryConfig {
    project?: string;
}

declare interface IVerboxSetup {
    domain?: string;
    language?: string;
    clientId?: number;
    returnMobileTriggerTimeout?: number;
}

declare interface IPaymentIQCashier {
    new (el: string, cashierConfig: IPiqCashierConfig, callback?: Function);
}

declare type TMethodName = 'fbq' | 'gtag';

declare type TAnalyticMethod = {
    [key in TMethodName]: Function;
}

declare interface Window extends TAnalyticMethod {
    WLC_VERSION: number;
    WLC_ENV?: string;
    WLC_FORBIDDEN?: boolean;
    wlcSentryConfig?: ISentryConfig;
    testSessionHash?: string;
    wlcPreload: any;
    Fingerprint2?: any;
    fingerprintHash?: string;
    requestIdleCallback?: any;
    Chatra?: any;
    ChatraSetup?: any;
    ChatraID?: string;
    ChatraGroupID?: string;
    Verbox?: any;
    supportAPIMethod?: string;
    VerboxSetup?: IVerboxSetup;
    Tawk_API?: any,
    __lc?: any;
    LC_API?: any;
    LiveChatWidget?: any;
    affiliate: string;
    WlcFlog: any;
    WlcCookie: any;
    WlcHelper: any;
    affCookie: any;
    _PaymentIQCashier?: IPaymentIQCashier;
    _PaymentIQCashierReset?: any;
    zESettings?: any;
    zE?: any;
    zEACLoaded?: boolean;
    grecaptcha?: ReCaptchaV2.ReCaptcha;
}
