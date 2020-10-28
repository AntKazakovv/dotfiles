import {Injectable} from '@angular/core';
import {
    ILayoutComponent,
    ILayoutsConfig,
    ILayoutSectionConfig,
    ILayoutStateConfig,
    ILayoutModifyItem,
} from 'wlc-engine/interfaces/layouts.interface';
import {ConfigService} from 'wlc-engine/modules/core/services/config/config.service';
import {SectionModel, ISectionData} from 'wlc-engine/modules/core/models/section.model';
import {StateParams} from '@uirouter/core';

import {
    cloneDeep as _cloneDeep,
    each as _each,
    extend as _extend,
    get as _get,
    isArray as _isArray,
    isString as _isString,
    isNumber as _isNumber,
    mergeWith as _mergeWith,
    reduce as _reduce,
    union as _union,
    map as _map,
    filter as _filter,
    findIndex as _findIndex,
    includes as _includes,
    toSafeInteger as _toSafeInteger,
    set as _set,
    isObject as _isObject,
    isUndefined as _isUndefined,
} from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class LayoutService {

    private readonly layouts: ILayoutsConfig;

    private components: {
        [key: string]: {
            [key: string]: unknown
        }
    } = {};

    private positionRegexp = /^(after|before)?\s?([^#]+)?#?(\d*)?/;

    constructor(
        private configService: ConfigService,
    ) {
        this.layouts = _get(this.configService, 'appConfig.$layouts');
    }

    public getLayoutConfig(state: string, params?: StateParams): ILayoutStateConfig {

        if (this.layouts.hasOwnProperty(state)) {

            if (params.category && this.layouts[state]?.subcategories?.[params.category]) {
                const subCategory = state += `.${params.category}`;

                if (this.layouts[state].subcategories[subCategory]?.extends) {
                    return _cloneDeep(_extend(
                        _cloneDeep(this.layouts[state].subcategories[subCategory]),
                        _mergeWith(
                            this.getLayoutConfig(this.layouts[state].subcategories[subCategory].extends),
                            this.layouts[state].subcategories[subCategory],
                            (target, source) => {
                                return _isArray(target) ? source : undefined;
                            })));
                }

                return _cloneDeep(this.layouts[state].subcategories[subCategory]);
            }

            if (this.layouts[state]?.extends) {
                return _cloneDeep(_extend(
                    _cloneDeep(this.layouts[state]),
                    _mergeWith(
                        this.getLayoutConfig(this.layouts[state].extends, params),
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

    public getAllSection(state: string, params?: StateParams): SectionModel[] {
        return _map(this.getLayoutConfig(state, params).sections, (section, name) => {
            return new SectionModel(<ISectionData>{section, name});
        });
    }

    public async getLayout(state: string, params?: StateParams): Promise<ILayoutStateConfig> {
        const res: ILayoutStateConfig = this.getLayoutConfig(state, params);

        _each(res.sections, (section) => {
            if (section.modify) {
                _each(section.modify, (item) => {
                    if (_isString(item.component)) {
                        item.component = {
                            name: item.component,
                        };
                    }
                    const position = this.getPosition(section, item);
                    switch (item.type) {
                    case 'insert':
                        section.components.splice(position, 0, item.component);
                        break;

                    case 'replace':
                        section.components[position] = item.component;
                        break;

                    case 'delete':
                        section.components.splice(position, 1);
                        break;
                    }
                });
            }
        });

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

                if (component.exclude?.length) {
                    section.components = _filter(section.components, (component: ILayoutComponent) => {
                        return !_includes(component.exclude, state);
                    });
                } else if (component.include?.length) {
                    section.components = _filter(section.components, (component: ILayoutComponent) => {
                        return _includes(component.include, state);
                    });
                }
            });
        });

        return res;
    }

    private getPosition(section: ILayoutSectionConfig, item: ILayoutModifyItem): number {
        if (_isNumber(item.position)) {
            return (item.position > 0) ? item.position - 1 : 0;
        } else {
            const positionParams = {
                shift: 0,
                index: 1,
                name: '',
            };

            const positionObject = this.positionRegexp.exec(item.position);

            if (!positionObject?.length) {
                return section.components.length;
            }

            let indexElem = 1;

            if (!positionObject[1] || _includes(['before', 'after'], positionObject[1])) {
                positionParams.shift = positionObject[1] === 'before' ? 0 : 1;
                indexElem = 2;
            }
            positionParams.name = positionObject[indexElem];

            if (positionObject.length > indexElem) {
                positionParams.index = _toSafeInteger(positionObject[indexElem + 1]) || 1;
            }

            let position = _findIndex(section.components, (component) => {
                const componentName = _isString(component) ? component : component.name;
                if (componentName === positionParams.name) {
                    if (positionParams.index === 1) {
                        return true;
                    } else {
                        positionParams.index--;
                    }
                }
                return false;
            });

            if (position === -1) {
                position = section.components.length;
            } else {
                position += positionParams.shift;
            }

            return (position < section.components.length) ? position : section.components.length;
        }
    }

    private async importModules(modules: string[]): Promise<void> {
        await Promise.all(
            modules.map(
                async (module) =>
                    this.components.hasOwnProperty(module)
                        ? Promise.resolve()
                        : this.importModule(module),
            ),
        );
    }

    public getComponent(name: string): unknown {
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
        case 'games':
            return import('wlc-engine/modules/games/games.module').then(m => {
                this.components.games = m.components;
                return m.GamesModule;
            });
        case 'static':
            return import('wlc-engine/modules/static/static.module').then(m => {
                this.components.static = m.components;
                return m.StaticModule;
            });
        case 'user':
            return import('wlc-engine/modules/user/user.module').then(m => {
                this.components.user = m.components;
                return m.UserModule;
            });
        }
    }
}
