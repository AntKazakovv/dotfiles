export type AppType = 'wlc' | 'aff' | 'kiosk';

export interface IAppConfig {
    type?: AppType;
    toHomeFromErrorTimeout?: number | false;
    demoMode?: boolean;
}
