import {Injectable} from '@angular/core';
import {
    ILayoutsConfig,
    ILayoutStateConfig,
    ILayoutSectionConfig,
    ILayoutComponent,
} from 'wlc-engine/interfaces';
import {ConfigService} from 'wlc-engine/modules/core/services/config/config.service';

import {
    cloneDeep as _cloneDeep,
    extend as _extend,
    mergeWith as _mergeWith,
    isArray as _isArray,
    get as _get,
    reduce as _reduce,
    union as _union,
    isString as _isString,
    each as _each,
    keys as _keys,
} from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {

    private layouts: ILayoutsConfig;

    private components: {[key: string]: {
        [key: string]: unknown
    }} = {};

    constructor(
        private config: ConfigService,
    ) {
        config.ready.then(() => {
            this.layouts = this.config.get('siteconfig.layouts');
        });
    }

    public async getLayoutConfig(state: string): Promise<ILayoutStateConfig> {
        await this.config.ready;
        if (this.layouts.hasOwnProperty(state)) {
            if (this.layouts[state].extends) {
                return _cloneDeep(_extend(
                    this.layouts[state],
                    _mergeWith(
                        this.getLayoutConfig(this.layouts[state].extends),
                        this.layouts[state],
                        (target, source) => {
                            return _isArray(target) ? source : undefined;
                        })));
            }
            return _cloneDeep(this.layouts[state]);
        } else {
            return _cloneDeep(this.layouts.app) || {};
        }
    }

    public async getAllSection(): Promise<string[]> {
        await this.config.ready;
        return _reduce(this.layouts, (res, state) => {
            return _union(res, _keys(state.sections));
        }, []);
    }

    public async getLayout(state: string): Promise<ILayoutStateConfig> {
        const res: ILayoutStateConfig = await this.getLayoutConfig(state);

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
