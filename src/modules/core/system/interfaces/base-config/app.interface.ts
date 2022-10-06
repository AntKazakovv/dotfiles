export type AppType = 'wlc' | 'aff' | 'kiosk' | 'mobile-app';

export interface IAppConfig {
    type?: AppType;
    toHomeFromErrorTimeout?: number | false;
    demoMode?: boolean;
}
