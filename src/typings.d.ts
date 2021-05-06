declare function require(path: string): {
    [key: string]: any;
    default: string;
};
declare function gettext<T>(str: T): T;

declare interface ISentryConfig {
    project?: string;
}

declare interface Window {
    WLC_VERSION: number;
    WLC_ENV?: string;
    WLC_FORBIDDEN?: boolean;
    wlcSentryConfig?: ISentryConfig;
    testSessionHash?: string;
    wlcPreload: any;
    Fingerprint2?: any;
    requestIdleCallback?: any;
    Chatra?: any;
    ChatraSetup?: any;
    ChatraID?: string;
    ChatraGroupID?: string;
    __lc?: any;
    LC_API?: any;
    affiliate: string;
    WlcFlog: any;
    affCookie: any;
}
