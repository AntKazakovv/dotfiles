import {
    Injectable,
    InjectionToken,
    Injector,
    Type,
    ProviderToken,
} from '@angular/core';

import _get from 'lodash-es/get';
import _set from 'lodash-es/set';
import _map from 'lodash-es/map';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {
    TModuleName,
    modulesApp,
    TStandaloneName,
    IFunctionImportStandalone,
    standaloneComponents,
} from 'wlc-engine/modules/core/system/constants/modules.constants';
import {
    externalServices,
    TExternalServices,
} from 'wlc-engine/modules/core/system/constants/external-services.constants';
import {ICustomStandalone} from 'wlc-engine/modules/core/system/interfaces/base-config/site.interface';

@Injectable({
    providedIn: 'root',
})
export class InjectionService {
    private components: IIndexing<IIndexing<unknown>> = {};
    private services: IIndexing<IIndexing<InjectionToken<unknown>>> = {};
    private standaloneList: IIndexing<Type<unknown>>  = {};
    private customStandaloneConfig: ICustomStandalone;
    private loadedModules: IIndexing<unknown> = {};

    constructor(
        private configService: ConfigService,
        private injector: Injector,
    ) {
        this.init();
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

        const [module] = name.split('.') as [TModuleName];

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
                await this.importModule(moduleName as TModuleName);
            }

            token = _get(this.loadedModules, `[${moduleName}].services[${serviceName}]`);

            _set(this.services, `[${moduleName}][${serviceName}]`, token);
        }

        return token ? this.injector.get<T>(token) : null;
    }

    /**
     * Load and return external service (not has module) class by it's name
     *
     * @param alias {string} alias of service
     *
     * @return {Promise<serviceName>}
     */
    public async getExternalService<T>(alias: TExternalServices, force?: boolean): Promise<T> {
        if (force || this.configService.get<boolean>(externalServices[alias]?.config)) {
            let token: ProviderToken<T> = _get(this.services as unknown, alias);

            if (!token) {
                token = await externalServices[alias].importFn().then((m) => {
                    return m[Object.keys(m)[0]];
                });
                _set(this.services, alias, token);
            }
            return this.injector.get<T>(token);
        }
    }

    /**
     * manual load modules
     *
     * @param modules {string[]} list of modules to load
     *
     * @return {Promise}
     */
    public async importModules(modules: TModuleName[]): Promise<void> {
        await Promise.all(_map(modules, async (module) => {
            return this.components.hasOwnProperty(module)
                ? Promise.resolve()
                : this.importModule(module);
        }));
    }

    public async loadStandalone(name: TStandaloneName): Promise<Type<unknown>> {
        if (!_get(this.standaloneList, name)) {
            await this.importStandalone(name);
        }

        return _get(this.standaloneList, name);
    }

    private async init(): Promise<void> {
        await this.configService.ready;

        this.customStandaloneConfig ??= this.configService.get<ICustomStandalone>('$base.site.customStandalone');
    }

    private importStandalone(name: TStandaloneName): unknown {
        if (this.loadedModules[name]) {
            return this.loadedModules[name];
        }

        const importStandaloneFunction: IFunctionImportStandalone | null = standaloneComponents[name]
            ?? (this.customStandaloneConfig.use
                ? this.customStandaloneConfig.listComponents[name]
                : null);

        if (importStandaloneFunction) {
            return importStandaloneFunction(this.afterStandaloneLoad.bind(this, name));
        } else {
            throw new Error(`Standalone "${name}" not found`);
        }
    }

    private afterStandaloneLoad(name: string, component: Type<unknown>): void {
        this.standaloneList[name] = component;
    }

    private importModule(name: TModuleName): unknown {
        if (this.loadedModules[name]) {
            return this.loadedModules[name];
        }

        const importModuleFunction: Function | undefined = modulesApp[name];

        if (importModuleFunction) {
            return importModuleFunction(name, this.afterModuleLoad.bind(this));
        } else {
            throw new Error('Module not found');
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
