import {
    Injectable,
    InjectionToken,
    Injector,
} from '@angular/core';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';

import _get from 'lodash-es/get';
import _set from 'lodash-es/set';
import _map from 'lodash-es/map';

@Injectable({
    providedIn: 'root',
})
export class InjectionService {
    private components: IIndexing<IIndexing<unknown>> = {};
    private services: IIndexing<IIndexing<InjectionToken<unknown>>> = {};
    private loadedModules: IIndexing<unknown> = {};

    constructor(
        private configService: ConfigService,
        private injector: Injector,
    ) {
    }

    /**
     * return component class by it's name
     *
     * @param name {string} name of component
     *
     * @return {componentClass}
     */
    public getComponent<T>(name: string): T | unknown {
        return _get(this.components, name);
    }

    /**
     * load and return component class by it's name
     *
     * @param name {string} name of component
     *
     * @return {Promise<unknown>}
     */
    public async loadComponent<T>(name: string): Promise<T | unknown> {

        const [module] = name.split('.');

        if (!_get(this.components, module)) {
            await this.importModules([module]);
        }

        return this.getComponent(name);
    }

    /**
     * load and return service class by it's name
     *
     * @param name {string} name of module.service
     *
     * @return {Promise<serviceName>}
     */
    public async getService<T>(name: string): Promise<T> {
        const [moduleName, serviceName] = name.split('.');

        let token = _get(this.services as any, `[${moduleName}][${serviceName}]`);


        if (!token) {
            if (!_get(this.services, moduleName)) {
                await this.importModule(moduleName);
            }


            token = _get(this.loadedModules, `[${moduleName}].services[${serviceName}]`);

            _set(this.services, `[${moduleName}][${serviceName}]`, token);
        }

        return token ? this.injector.get<T>(token) : null;
    }

    /**
     * manual load modules
     *
     * @param modules {string[]} list of modules to load
     *
     * @return {Promise}
     */
    public async importModules(modules: string[]): Promise<void> {
        await Promise.all(_map(modules, async (module) => {
            return this.components.hasOwnProperty(module)
                ? Promise.resolve()
                : this.importModule(module);
        }));
    }

    private async importModule(name: string): Promise<any> {
        switch (name) {
            case 'core':
                if (this.loadedModules.core) {
                    return this.loadedModules.core;
                }
                return import('wlc-engine/modules/core/core.module').then(m => {
                    this.afterModuleLoad('core', m);
                    return m.CoreModule;
                });
            case 'menu':
                if (this.loadedModules.menu) {
                    return this.loadedModules.menu;
                }
                return import('wlc-engine/modules/menu/menu.module').then(m => {
                    this.afterModuleLoad('menu', m);
                    return m.MenuModule;
                });
            case 'games':
                if (this.loadedModules.games) {
                    return this.loadedModules.games;
                }
                return import('wlc-engine/modules/games/games.module').then(m => {
                    this.afterModuleLoad('games', m);
                    return m.GamesModule;
                });
            case 'static':
                if (this.loadedModules.static) {
                    return this.loadedModules.static;
                }
                return import('wlc-engine/modules/static/static.module').then(m => {
                    this.afterModuleLoad('static', m);
                    return m.StaticModule;
                });
            case 'promo':
                if (this.loadedModules.promo) {
                    return this.loadedModules.promo;
                }
                return import('wlc-engine/modules/promo/promo.module').then(m => {
                    this.afterModuleLoad('promo', m);
                    return m.PromoModule;
                });
            case 'user':
                if (this.loadedModules.user) {
                    return this.loadedModules.user;
                }
                return import('wlc-engine/modules/user/user.module').then(m => {
                    this.afterModuleLoad('user', m);
                    return m.UserModule;
                });
            case 'finances':
                if (this.loadedModules.finances) {
                    return this.loadedModules.finances;
                }
                return import('wlc-engine/modules/finances/finances.module').then(m => {
                    this.afterModuleLoad('finances', m);
                    return m.FinancesModule;
                });
            case 'bonuses':
                if (this.loadedModules.bonuses) {
                    return this.loadedModules.bonuses;
                }
                return import('wlc-engine/modules/bonuses/bonuses.module').then(m => {
                    this.afterModuleLoad('bonuses', m);
                    return m.BonusesModule;
                });
            case 'store':
                if (this.loadedModules.store) {
                    return this.loadedModules.store;
                }
                return import('wlc-engine/modules/store/store.module').then(m => {
                    this.afterModuleLoad('store', m);
                    return m.StoreModule;
                });
            case 'tournaments':
                if (this.loadedModules.tournaments) {
                    return this.loadedModules.tournaments;
                }
                return import('wlc-engine/modules/tournaments/tournaments.module').then(m => {
                    this.afterModuleLoad('tournaments', m);
                    return m.TournamentsModule;
                });
            case 'profile':
                if (this.loadedModules.profile) {
                    return this.loadedModules.profile;
                }
                return import('wlc-engine/modules/profile/profile.module').then(m => {
                    this.afterModuleLoad('profile', m);
                    return m.ProfileModule;
                });
            case 'sportsbook':
                if (this.loadedModules.sportsbook) {
                    return this.loadedModules.sportsbook;
                }
                return import('wlc-engine/modules/sportsbook/sportsbook.module').then(m => {
                    this.afterModuleLoad('sportsbook', m);
                    return m.SportsbookModule;
                });
            case 'livechat':
                if (this.loadedModules.livechat) {
                    return this.loadedModules.livechat;
                }
                return import('wlc-engine/modules/livechat/livechat.module').then(m => {
                    this.afterModuleLoad('livechat', m);
                    return m.LivechatModule;
                });
            case 'compiler':
                if (this.loadedModules.compiler) {
                    return this.loadedModules.compiler;
                }
                return import('wlc-engine/modules/compiler/compiler.module').then(m => {
                    this.afterModuleLoad('compiler', m);
                    return m.CompilerModule;
                });
            case 'custom':
                if (this.loadedModules.custom) {
                    return this.loadedModules.custom;
                }
                return import('wlc-src/custom/custom.module').then(m => {
                    this.afterModuleLoad('custom', m);
                    return m.CustomModule;
                });
            case 'analytics':
                if (this.loadedModules.analytics) {
                    return this.loadedModules.analytics;
                }
                return import('wlc-engine/modules/analytics/analytics.module').then(m => {
                    this.afterModuleLoad('analytics', m);
                    return m.AnalyticsModule;
                });
            case 'monitoring':
                if (this.loadedModules.monitoring) {
                    return this.loadedModules.monitoring;
                }
                return import('wlc-engine/modules/monitoring/monitoring.module').then(m => {
                    this.afterModuleLoad('monitoring', m);
                    return m.MonitoringModule;
                });
            case 'internal-mails':
                if (this.loadedModules.InternalMailsModule) {
                    return this.loadedModules.InternalMailsModule;
                }
                return import('wlc-engine/modules/internal-mails/internal-mails.module').then(m => {
                    this.afterModuleLoad('internal-mails', m);
                    return m.InternalMailsModule;
                });
            case 'loyalty':
                if (this.loadedModules.LoyaltyModule) {
                    return this.loadedModules.LoyaltyModule;
                }
                return import('wlc-engine/modules/loyalty/loyalty.module').then(m => {
                    this.afterModuleLoad('loyalty', m);
                    return m.LoyaltyModule;
                });
            case 'metamask':
                if (this.loadedModules.MetamaskModule) {
                    return this.loadedModules.MetamaskModule;
                }
                return import('wlc-engine/modules/metamask/metamask.module').then(m => {
                    this.afterModuleLoad('metamask', m);
                    return m.MetamaskModule;
                });
        }
    }

    private afterModuleLoad(name: string, loadedModule: any): void {
        this.loadedModules[name] = loadedModule;
        if (loadedModule.moduleConfig) {
            this.configService.set({
                name: '$' + name,
                value: loadedModule.moduleConfig,
            });
        }
        this.components[name] = loadedModule.components;
    }
}
