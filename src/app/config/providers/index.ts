import {APP_INITIALIZER, Provider} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {APP_CONFIG} from 'tokens';
import {DataService} from 'modules/core/data/services/data/data.service';
import {AppProvider} from 'modules/core/data/providers/app/app.provider';

import {SITECONFIG_DEFAULT} from 'config/siteconfig';

import {
    get as _get,
    isArray as _isArray,
    mergeWith as _mergeWith
} from 'lodash';

let SITECONFIG_BOOTSTRAP;

export interface IAppProvidersConfig {
    siteconfig: any;
}

export const appProviders = (config: IAppProvidersConfig): Provider[] => [
    {
        provide: APP_INITIALIZER,
        multi: true,
        deps: [AppProvider, DataService, HttpClient],
        useFactory: (provider: AppProvider) => {
            return () => {
                return provider.bootstrap().then((data) => {
                    SITECONFIG_BOOTSTRAP = data;
                });
            };
        }
    },
    {
        provide: APP_CONFIG,
        useFactory: () => {
            const customizer = (objValue, srcValue) => {
                if (_isArray(objValue)) {
                    return srcValue;
                }
            };
            const appConfig = _mergeWith(SITECONFIG_BOOTSTRAP, _get(config.siteconfig, {} as any), customizer);
            return _mergeWith(SITECONFIG_DEFAULT, appConfig, customizer);
        }
    }
];
