export type AppType = 'wlc' | 'aff';

export interface IAppConfig {
    type?: AppType;
    toHomeFromErrorTimeout?: number | false;
}
