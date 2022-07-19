declare function require(path: string): {
    [key: string]: any;
    default: string;
};
declare function gettext<T>(str: T): T;

declare interface IWlcPostMessage {
    event: string;
    eventData?: string;
}

declare interface ISentryConfig {
    project?: string;
}

declare interface IDigitainNavigateEvent {
    /** id of selected match game */
    targetId: number;
    /** name of selected tournament */
    targetName: string;
    /** name of selected page inside sportsbook */
    pageName: string;
}

declare interface IVerboxSetup {
    domain?: string;
    language?: string;
    clientId?: number;
    returnMobileTriggerTimeout?: number;
}

declare interface IScreenfull {
    isFullscreen: boolean;
    element: Element | undefined;
    isEnabled: boolean;
    raw: ScreenfullRawEventNames;
    request(element?: Element, options?: FullscreenOptions): Promise<void>;
    exit(): Promise<void>;
    toggle(element?: Element, options?: FullscreenOptions): Promise<void>;
    on(name: ScreenfullEventName, handler: (event: Event) => void): void;
    off(name: ScreenfullEventName, handler: (event: Event) => void): void;
    onchange(handler: (event: Event) => void): void;
    onerror(handler: (event: Event) => void): void;
}

declare type TDigitainOnNavigate = (event: IDigitainNavigateEvent) => void;

declare type ScreenfullEventName = 'change' | 'error';

declare type ScreenfullRawEventNames = {
    readonly requestFullscreen: string;
    readonly exitFullscreen: string;
    readonly fullscreenElement: string;
    readonly fullscreenEnabled: string;
    readonly fullscreenchange: string;
    readonly fullscreenerror: string;
};

declare type TExternalSBPageSwitch = (pageId: number) => void;

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
    _PaymentIQCashierReset?: () => void;
    zESettings?: any;
    zE?: any;
    zEACLoaded?: boolean;
    grecaptcha?: ReCaptchaV2.ReCaptcha;
    // change page of tglab sportsbook
    externalSBPageSwitch?: TExternalSBPageSwitch;
    // digitain iframe navigation handler
    digitainOnNavigate?: TDigitainOnNavigate;
}
