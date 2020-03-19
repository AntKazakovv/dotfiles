import {InjectionToken} from "@angular/core";

export interface IAppEnv {
    production: boolean;
    site: string;
}

export const APP_ENVIRONMENT = new InjectionToken<IAppEnv>('app.environment');

export const APP_CONFIG = new InjectionToken<any>('app.config');
