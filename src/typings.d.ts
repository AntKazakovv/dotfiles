import {PreloaderLogo} from 'wlc-engine/system/inline/_preloader-logo';

export declare global {

    function require(path: string): {
        [key: string]: any;
        default: string;
    };

    function gettext<T>(str: T): T;

    interface IScreenfull {
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
    interface IWlcPostMessage {
        event: string;
        eventData?: string;
    }

    interface ISentryConfig {
        project?: string;
    }

    interface IVerboxSetup {
        domain?: string;
        language?: string;
        clientId?: number;
        returnMobileTriggerTimeout?: number;
    }

    interface IPaymentIQCashier {
        new (el: string, cashierConfig: IPiqCashierConfig, callback?: Function);
    }

    interface IScreenfull {
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

    type ScreenfullEventName = 'change' | 'error';

    type ScreenfullRawEventNames = {
        readonly requestFullscreen: string;
        readonly exitFullscreen: string;
        readonly fullscreenElement: string;
        readonly fullscreenEnabled: string;
        readonly fullscreenchange: string;
        readonly fullscreenerror: string;
    };

    type TExternalSBPageSwitch = (pageId: number) => void;

    type TMethodName = 'fbq' | 'gtag';

    type TAnalyticMethod = {
        [key in TMethodName]: Function;
    }

    interface Window extends TAnalyticMethod {
        WLC_VERSION: number;
        WlcPreloaderLogo: PreloaderLogo;
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
        // change page of tglab sportsbook
        externalSBPageSwitch?: TExternalSBPageSwitch;
    }
}
