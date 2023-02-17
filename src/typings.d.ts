declare function require(path: string): {
    [key: string]: any;
    default: string;
};
declare function gettext<T>(str: T): T;

declare interface IEnvironment {
    production: boolean;
    mobileApp?: TMobileApp;
}

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

declare interface IMobileDigitainApp {
    navigateTo: (pageUrl: string) => void;
    addEventListener: (eventName: string, handler: (event: unknown) => void) => void;
}

declare interface IApkFile {
    path?: string;
    url?: string;
}

declare type TDigitainOnNavigate = (event: IDigitainNavigateEvent) => void;

declare type TInitDigitainApp = (app: IMobileDigitainApp) => void;

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

declare type TBundleType = 'site' | 'google-play' | 'app-store';

declare type TBundleType = 'site' | 'google-play' | 'app-store';

declare type TMobileApp = {
    apiUrl: string;
    translationsDomain?: string;
    availableOnlyCountries?: string[];
    bundleType: TBundleType;
    apkFile?: IApkFile;
    site?: string;
}

declare namespace universalLinks {
    type TSubscribe = (eventName: string | null, callback: (data: EventData) => void) => void;
    type TUnsubscribe = (eventName: string | null) => void;

    interface IEventData {
        url: string;
        scheme: string;
        host: string;
        path: string;
        params: {
            [key: string]: string;
        };
        hash: string;
    }

    interface IUniversalLinks {
        bindEvents: () => void;
        checkDeepLink: (milliseconds) => void;
        didLaunchAppFromLink: (eventData: IEventData) => void;
        dpLink: string;
        eventName: string;
        host: string;
        initialize: () => void;
        onDeviceReady: () => void;
        regex: RegExp;
        subscribe: TSubscribe;
        unsubscribe: TUnsubscribe;
        validateDeepLink: () => void;
    }
}

declare interface Window extends TAnalyticMethod {
    WLC_VERSION: number;
    WLC_ENV?: string;
    WLC_FORBIDDEN?: boolean;
    wlcSentryConfig?: ISentryConfig;
    testSessionHash?: string;
    wlcPreload: any;
    requestIdleCallback?: any;
    Chatra?: any;
    ChatraSetup?: any;
    ChatraID?: string;
    ChatraGroupID?: string;
    Verbox?: any;
    supportAPIMethod?: string;
    VerboxSetup?: IVerboxSetup;
    Tawk_API?: any,
    tawk?: any;
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
    $zoho?: any;
    grecaptcha?: ReCaptchaV2.ReCaptcha;
    // change page of tglab sportsbook
    externalSBPageSwitch?: TExternalSBPageSwitch;
    /*
     * Digitain desktop iframe navigation handler.
     * Use callback that was triggered after changing navigation inside sportsbook iframe
     */
    digitainOnNavigate?: TDigitainOnNavigate;
    ethereum?: {
        request: (prams: {method: string, params?: any[]}) => any;
        [key: string]: any;
    };
    /*
     * Digitain mobile handlers inizializator
     */
    initDigitainApp?: TInitDigitainApp;
    mobileApp?: TMobileApp;
    cordova?: any;
    universalLinks?: universalLinks.IUniversalLinks;
    ApkUpdater?: any;
}

declare const WLC_VERSION: number;

// CHAT ONLY
declare module '@xmpp/client' {

    import {EventEmitter} from '@xmpp/events';
    import {JID} from '@xmpp/jid';
    import {Element} from 'ltx';

    export class Client {

        public timeout: number;

        public reconnect: Reconnect;

        public iqCaller: IqCaller;

        public plugins: any;

        public status: string;

        public on(eventName: string, callback: any): void;

        public handle(eventName: string, callback: any): void;

        public write(message: string): void;

        public start(): Promise<void>;

        public stop(): void;

        public send(content: any): PromiseLike<void>;

        public plugin(plugin: any): void;

        public removeAllListeners(): void;

    }

    export function client(clientConf: ClientConfiguration): Client;

    export function jid(fullJid: string): JID;
    // tslint:disable-next-line:unified-signatures
    export function jid(local: string, domain: string, resource?: string): JID;

    export function xml(name: string, attrs?: {[key: string]: string}, ...content: any[]): Element;

    export interface ClientConfiguration {
        service: string;
        domain: string;
        resource?: string;
        username?: string;
        password?: string;
        credentials?: (auth: (config: {
            username: string;
            password: string;}) => Promise<void>, mechanism: any) => Promise<void>;
    }

    export interface Reconnect extends EventEmitter {

        stop(): void;

        reconnect(): void;

    }

    export interface IqCaller {

        request(stanza: Element): Promise<Element>;

    }

}

declare module '@xmpp/events' {

    export function timeout<T>(promise: Promise<T>, timeoutInMS: number): Promise<T>;

    export class EventEmitter {
        addListener(event: string | symbol, listener: (...args: any[]) => void): this;

        on(event: string | symbol, listener: (...args: any[]) => void): this;

        once(event: string | symbol, listener: (...args: any[]) => void): this;

        removeListener(event: string | symbol, listener: (...args: any[]) => void): this;

        removeAllListeners(event?: string | symbol): this;

        setMaxListeners(n: number): this;

        getMaxListeners(): number;

        listeners(event: string | symbol): Function[]; // tslint:disable-line:ban-types
        emit(event: string | symbol, ...args: any[]): boolean;

        listenerCount(type: string | symbol): number;

        // Added in Node 6...
        prependListener(event: string | symbol, listener: (...args: any[]) => void): this;

        prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;

        eventNames(): Array<string | symbol>;
    }

}

declare module '@xmpp/jid' {

    export class JID {

        local: string;
        domain: string;
        resource: string;

        constructor(local: string, domain: string, resource?: string);

        bare(): JID;

        equals(other: JID): boolean;

        toString(): string;

    }

    export function jid(jid: string): JID;

}

declare module '@xmpp/resource-binding';
declare module '@xmpp/iq';
declare module '@xmpp/reconnect';
declare module '@xmpp/sasl-plain';
declare module '@xmpp/session-establishment';
declare module '@xmpp/websocket';
