import {
    Injectable,
    InjectionToken,
    Injector,
} from '@angular/core';

import _get from 'lodash-es/get';
import _set from 'lodash-es/set';
import _map from 'lodash-es/map';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {
    TModuleName,
    modulesApp,
} from 'wlc-engine/modules/core/system/constants/modules.constants';

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
