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
import {IIndexing} from 'wlc-engine/interfaces';
import {WrapperComponent} from 'wlc-engine/modules/core';

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
    } = {
        core: {
            'wlc-wrapper': WrapperComponent,
        },
    };
    private positionRegexp = /^(after|before)?\s?([^#]+)?#?(\d*)?/;

    constructor(
        protected ConfigService: ConfigService,
    ) {
        this.layouts = this.ConfigService.get<ILayoutsConfig>('$layouts');
    }

    public getLayoutConfig(state: string, params?: IIndexing<any>): ILayoutStateConfig {
        const mergeExtendsLayout = () => {
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
        };

        if (this.layouts.hasOwnProperty(state)) {
            const paramsPath: string = params?.category || params?.slug;

            if (paramsPath) {
                const subCategoryPath = `${state}.${paramsPath}`;
                const subCategories = this.layouts[state]?.subcategories;

                if (subCategories?.[subCategoryPath]) {
                    if (subCategories[subCategoryPath]?.extends) {
                        return _cloneDeep(_extend(
                            _cloneDeep(subCategories[subCategoryPath]),
                            _mergeWith(
                                this.getLayoutConfig(subCategories[subCategoryPath].extends),
                                subCategories[subCategoryPath],
                                (target, source) => {
                                    return _isArray(target) ? source : undefined;
                                })));
                    }
                    return _cloneDeep(subCategories[subCategoryPath]);
                } else {
                    return mergeExtendsLayout();
                }
            }
            return mergeExtendsLayout();
        } else {
            return _cloneDeep(this.layouts.app) || {};
        }
    }

    /**
    Return all sections of current state
     */
    public getAllSection(state: string, params?: IIndexing<any>): SectionModel[] {
        return _map(this.getLayoutConfig(state, params)?.sections, (section, name) => {
            return new SectionModel(<ISectionData>{section, name});
        });
    }

    public async getLayout(state: string, params?: IIndexing<any>): Promise<ILayoutStateConfig> {
        const res: ILayoutStateConfig = this.getLayoutConfig(state, params);

        _each(res?.sections, (section) => {
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

    public getComponent(name: string): unknown {
        return _get(this.components, name);
    }

    public async loadComponent(name: string): Promise<unknown> {

        const [module] = name.split('.');

        if (!_get(this.components, module)) {
            await this.importModules([module]);
        }

        return _get(this.components, name);
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
            case 'promo':
                return import('wlc-engine/modules/promo/promo.module').then(m => {
                    this.components.promo = m.components;
                    return m.PromoModule;
                });
            case 'user':
                return import('wlc-engine/modules/user/user.module').then(m => {
                    this.components.user = m.components;
                    return m.UserModule;
                });
            case 'finances':
                return import('wlc-engine/modules/finances/finances.module').then(m => {
                    this.components.finances = m.components;
                    return m.FinancesModule;
                });
        }
    }
}
