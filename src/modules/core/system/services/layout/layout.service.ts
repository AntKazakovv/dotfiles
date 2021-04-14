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
import {GlobalHelper, IGlobalConfig} from 'wlc-engine/modules/core';

import _cloneDeep from 'lodash-es/cloneDeep';
import _each from 'lodash-es/each';
import _extend from 'lodash-es/extend';
import _isString from 'lodash-es/isString';
import _isNumber from 'lodash-es/isNumber';
import _get from 'lodash-es/get';
import _includes from 'lodash-es/includes';
import _mergeWith from 'lodash-es/mergeWith';
import _reduce from 'lodash-es/reduce';
import _isArray from 'lodash-es/isArray';
import _union from 'lodash-es/union';
import _map from 'lodash-es/map';
import _filter from 'lodash-es/filter';
import _findIndex from 'lodash-es/findIndex';
import _toSafeInteger from 'lodash-es/toSafeInteger';
import _min from 'lodash-es/min';
import _max from 'lodash-es/max';
import _isUndefined from 'lodash-es/isUndefined';


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

    /**
     * Return layout config
     *
     * @param type {string} type of layout config pages || panels
     * @param state {string} state
     * @param params {IIndexing<any>} state params
     *
     * @return {ILayoutStateConfig}
     */
    public getLayoutConfig(type: LayoutsType, state: string, params?: IIndexing<any>): ILayoutStateConfig {
        const config = this.getLayoutConfig$(type, state, params);
        _each(config.sections, (section, name) => {
            if (section === null) {
                delete config.sections[name];
            }
        });
        return config;
    }

    /**
     Return all sections of current state
     * @param type {string} type of layout config pages || panels
     * @param state {string} state
     * @param params {IIndexing<any>} state params
     *
     * @return {SectionModel[]}
     */
    public getAllSection(type: LayoutsType, state: string, params?: IIndexing<any>): SectionModel[] {
        return _map(
            this.getLayoutConfig(type, state, params)?.sections,
            (section, name) => {
                return new SectionModel(<ISectionData>{section, name});
            });
    }
    /**
     * @param type {string} type of layout config pages || panels
     * @param state {string} state
     * @param params {IIndexing<any>} state params
     *
     * @return {Promise<ILayoutStateConfig>}
     */
    public async getLayout(type: LayoutsType, state: string, params?: IIndexing<any>): Promise<ILayoutStateConfig> {
        const res: ILayoutStateConfig = this.getLayoutConfig(type, state, params);

        _each(res?.sections, (section) => {
            if (section?.modify && section?.components) {
                _each(section.modify, (item) => {
                    if (_isString(item.component)) {
                        item.component = {
                            name: item.component,
                        };
                    }
                    const position = this.getPosition(section, item);
                    switch (item.type) {
                        case 'insert':
                            if (item.component.name) {
                                section.components.splice(position, 0, item.component as ILayoutComponent);
                            }
                            break;

                        case 'replace':
                            if (item.component.name) {
                                section.components[position] = item.component as ILayoutComponent;
                            }
                            break;

                        case 'delete':
                            section.components.splice(position, 1);
                            break;

                        case 'merge':
                            const component = (_isString(section.components[position]))
                                ? {name: section.components[position] as string}
                                : section.components[position];
                            section.components[position] = GlobalHelper.mergeConfig(_cloneDeep(component), item.component);
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

    /**
     * return component class by it's name
     *
     * @param name {string} name of component
     *
     * @return {componentClass}
     */
    public getComponent(name: string): unknown {
        return _get(this.components, name);
    }

    /**
     * load and return component class by it's name
     *
     * @param name {string} name of component
     *
     * @return {Promise<unknown>}
     */
    public async loadComponent(name: string): Promise<unknown> {

        const [module] = name.split('.');

        if (!_get(this.components, module)) {
            await this.importModules([module]);
        }

        return _get(this.components, name);
    }

    /**
     * manual load modules
     *
     * @param modules {string[]} list of modules to load
     *
     * @return {Promise}
     */
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

    public createMediaQuery(display: {before?: number, after?: number}): string {
        const mediaQuery: string[] = [];
        const queries = [display.after, display.before];
        const min: number = _min(queries),
            max: number = _max(queries);

        if (!_isUndefined(min)) {
            mediaQuery.push(`(min-width: ${min}px)`);
        }

        if (!_isUndefined(max)) {
            mediaQuery.push(`(max-width: ${max}px)`);
        }

        return mediaQuery.join(' and ');
    }

    public async generateFullConfigWithLayouts(full: boolean = false): Promise<Partial<IGlobalConfig>> {
        await this.configService.ready;
        await this.importModules(['core', 'menu', 'games', 'static', 'promo', 'user', 'finances', 'bonuses', 'store', 'profile', 'sportsbook']);
        const config = _cloneDeep(this.configService.globalConfig);

        if (full) {
            const layout = {};
            const panel = {};
            const promises = [];

            _each(config.$layouts, async (_, state) => {
                promises.push(new Promise(async (resolve) => {
                    layout[state] = await this.getLayout('pages', state);
                    resolve(true);
                }));
            });
            _each(config.$panelsLayouts, async (_, state) => {
                promises.push(new Promise(async (resolve) => {
                    panel[state] = await this.getLayout('panels', state);
                    resolve(true);
                }));
            });

            await Promise.all(promises);
            config.$layouts = layout;
            config.$panelsLayouts = panel;

        } else {
            config.$layouts = _cloneDeep(this.configService.get<ILayoutsConfig>('$layouts'));
            config.$panelsLayouts = _cloneDeep(this.configService.get<IPanelsConfig>('$panelsLayouts'));
        }
        return config;
    }

    private async prepareLayouts(): Promise<void> {
        await this.configService.ready;

        this.layouts.pages = this.configService.get<ILayoutsConfig>('$layouts');
        this.layouts.panels = this.configService.get<IPanelsConfig>('$panelsLayouts');
    }

    private getLayoutConfig$(type: LayoutsType, state: string, params?: IIndexing<any>): ILayoutStateConfig {
        const mergeExtendsLayout = () => {
            if (this.layouts[type][state]?.extends) {
                return _cloneDeep(_extend(
                    _cloneDeep(this.layouts[type][state]),
                    _mergeWith(
                        this.getLayoutConfig$(type, this.layouts[type][state].extends, params),
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
                                this.getLayoutConfig$(type, subCategories[subCategoryPath].extends),
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
                positionParams.shift = positionObject[1] === 'after' ? 1 : 0;
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
            case 'custom':
                if (this.loadedModules.custom) {
                    return this.loadedModules.custom;
                }
                return import('wlc-src/custom/custom.module').then(m => {
                    this.afterModuleLoad('custom', m);
                    return m.CustomModule;
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
