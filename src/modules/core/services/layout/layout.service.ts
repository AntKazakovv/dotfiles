import {Injectable} from '@angular/core';

import {
    cloneDeep as _cloneDeep,
    each as _each,
    extend as _extend,
    get as _get,
    isArray as _isArray,
    isString as _isString,
    keys as _keys,
    mergeWith as _mergeWith,
    reduce as _reduce,
    union as _union,
} from 'lodash';
import {ILayoutComponent, ILayoutsConfig, ILayoutSectionConfig, ILayoutStateConfig} from 'wlc-engine/interfaces';
import {ConfigService} from 'wlc-engine/modules/core/services/config/config.service';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {

    private readonly layouts: ILayoutsConfig;

    private components: {
        [key: string]: {
            [key: string]: unknown
        }
    } = {};

    constructor(
        private configService: ConfigService,
    ) {
        this.layouts = _get(this.configService, 'appConfig.$layouts');
    }

    public getLayoutConfig(state: string): ILayoutStateConfig {
        if (this.layouts.hasOwnProperty(state)) {
            if (this.layouts[state].extends) {
                return _extend(
                    _cloneDeep(this.layouts[state]),
                    _mergeWith(
                        this.getLayoutConfig(this.layouts[state].extends),
                        this.layouts[state],
                        (target, source) => {
                            return _isArray(target) ? source : undefined;
                        }));
            }
            return _cloneDeep(this.layouts[state]);
        } else {
            return _cloneDeep(this.layouts.app) || {};
        }
    }

    public getAllSection(): string[] {
        // await this.config.ready;
        return _reduce(this.layouts, (res, state) => {
            return _union(res, _keys(state.sections));
        }, []);
    }

    public async getLayout(state: string): Promise<ILayoutStateConfig> {
        const res: ILayoutStateConfig = this.getLayoutConfig(state);

        const modules = _reduce(res.sections, (sRes: string[], section: ILayoutSectionConfig) =>
            _union(sRes, section.components?.reduce((cRes: string[], component: (ILayoutComponent | string)) => {
                const splitComponent = (_isString(component) ? component : component.name).split('.');
                if (splitComponent.length >= 2) {
                    return _union(cRes, [splitComponent[0]]);
                }
                return cRes;
            }, [])), []);

        await this.importModules(modules);

        _each(res.sections, (section) => {
            _each(section.components, (component) => {
                if (_isString(component)) {
                    component = {
                        name: component,
                        componentClass: this.getComponent(component),
                    };
                } else {
                    component.componentClass = this.getComponent(component.name);
                }
            });
        });

        return res;
    }

    private async importModules(modules: string[]): Promise<void> {
        await Promise.all(
            modules.map(
                async (module) =>
                    this.components.hasOwnProperty(module)
                        ? Promise.resolve()
                        : this.importModule(module)
            )
        );
    }

    private getComponent(name: string): unknown {
        return _get(this.components, name);
    }

    private async importModule(name: string): Promise<any> {
        switch (name) {
            case 'base':
                return import('wlc-engine/modules/base/base.module').then(m => {
                    this.components.base = m.components;
                    return m.BaseModule;
                });
            case 'menu':
                return import('wlc-engine/modules/menu/menu.module').then(m => {
                    this.components.menu = m.components;
                    return m.MenuModule;
                });
        }
    }
}
