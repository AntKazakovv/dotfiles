import {Injectable} from '@angular/core';
import {
    ILayoutComponent,
    ILayoutsConfig,
    ILayoutSectionConfig,
    ILayoutStateConfig,
    ILayoutModifyItem,
    IPanelsConfig,
} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {SectionModel, ISectionData} from 'wlc-engine/modules/core/system/models/section.model';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

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
} from 'lodash';

export type LayoutsType = 'pages' | 'panels';

interface ILayouts {
    pages: ILayoutsConfig;
    panels: IPanelsConfig;
}

@Injectable({
    providedIn: 'root',
})
export class LayoutService {

    private readonly layouts: ILayouts = {
        pages: {},
        panels: {},
    };

    private components: {
        [key: string]: {
            [key: string]: unknown
        }
    } = {};
    private positionRegexp = /^(after|before)?\s?([^#]+)?#?(\d*)?/;

    private loadedModules: IIndexing<unknown> = {};

    constructor(
        protected configService: ConfigService,
    ) {
        this.prepareLayouts();
    }

    public getLayoutConfig(type: LayoutsType, state: string, params?: IIndexing<any>): ILayoutStateConfig {
        const mergeExtendsLayout = () => {
            if (this.layouts[type][state]?.extends) {
                return _cloneDeep(_extend(
                    _cloneDeep(this.layouts[type][state]),
                    _mergeWith(
                        this.getLayoutConfig(type, this.layouts[type][state].extends, params),
                        this.layouts[type][state],
                        (target, source) => {
                            return _isArray(target) ? source : undefined;
                        })));
            }

            return _cloneDeep(this.layouts[type][state]);
        };
        if (this.layouts[type].hasOwnProperty(state)) {
            const paramsPath: string = params?.category || params?.slug;

            if (paramsPath) {
                const subCategoryPath = `${state}.${paramsPath}`;
                const subCategories = this.layouts[type][state]?.subcategories;

                if (subCategories?.[subCategoryPath]) {
                    if (subCategories[subCategoryPath]?.extends) {
                        return _cloneDeep(_extend(
                            _cloneDeep(subCategories[subCategoryPath]),
                            _mergeWith(
                                this.getLayoutConfig(type, subCategories[subCategoryPath].extends),
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
            return _cloneDeep(this.layouts[type].app) || {};
        }
    }

    /**
     Return all sections of current state
     */
    public getAllSection(type: LayoutsType, state: string, params?: IIndexing<any>): SectionModel[] {
        return _map(this.getLayoutConfig(type, state, params)?.sections, (section, name) => {
            return new SectionModel(<ISectionData>{section, name});
        });
    }

    public async getLayout(type: LayoutsType, state: string, params?: IIndexing<any>): Promise<ILayoutStateConfig> {
        const res: ILayoutStateConfig = this.getLayoutConfig(type, state, params);

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

    private async prepareLayouts(): Promise<void> {
        await this.configService.ready;

        this.layouts.pages = this.configService.get<ILayoutsConfig>('$layouts');
        this.layouts.panels = this.configService.get<IPanelsConfig>('$panelsLayouts');
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

    public async importModules(modules: string[]): Promise<void> {
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
