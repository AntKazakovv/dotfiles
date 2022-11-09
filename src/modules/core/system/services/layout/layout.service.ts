import {Inject, Injectable} from '@angular/core';

import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {IGlobalConfig} from 'wlc-engine/modules/core/system/services/config/config.interface';
import {
    ILayoutComponent,
    ILayoutsConfig,
    ILayoutSectionConfig,
    ILayoutStateConfig,
    ILayoutModifyItem,
    IPanelsConfig,
    IDisplayConfig,
} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import {WINDOW} from 'wlc-engine/modules/app/system';

import {SectionModel, ISectionData} from 'wlc-engine/modules/core/system/models/section.model';

import _cloneDeep from 'lodash-es/cloneDeep';
import _each from 'lodash-es/each';
import _extend from 'lodash-es/extend';
import _isString from 'lodash-es/isString';
import _isNumber from 'lodash-es/isNumber';
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
import _isObject from 'lodash-es/isObject';

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

    private positionRegexp = /^(after|before)?\s?([^#]+)?#?(\d*)?/;

    constructor(
        protected configService: ConfigService,
        protected injectionService: InjectionService,
        @Inject(WINDOW) protected window: Window,
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
                            section.components[position] = GlobalHelper
                                .mergeConfig(_cloneDeep(component), item.component);
                            break;
                    }
                });
            }
        });

        const modules = _reduce(res.sections, (sRes: string[], section: ILayoutSectionConfig) =>
            _union(sRes, section.components?.reduce((cRes: string[], component: (ILayoutComponent | string)) => {
                try {
                    const splitComponent = (_isString(component) ? component : component.name).split('.');
                    if (splitComponent.length >= 2) {
                        return _union(cRes, [splitComponent[0]]);
                    }
                    return cRes;
                } catch (error) {
                    console.error('Wrong layout config', error);
                }
            }, [])), []);

        await this.injectionService.importModules(modules);

        _each(res.sections, (section) => {
            _each(section.components, (component) => {
                if (_isString(component)) {
                    component = {
                        name: component,
                        componentClass: this.injectionService.getComponent(component),
                    };
                } else {
                    component.componentClass = this.injectionService.getComponent(component.name);
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
     * Return media query string
     *
     * @param display media query params
     *
     * @returns string with media query
     */
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

    /**
     * Return list of filtred element by display params
     *
     * @param elementList - List of element with display params
     *
     * @returns filtered elements
     */
    public filterDisplayElements<T>(elementList: ({display?: IDisplayConfig} & T)[]): T[] {
        GlobalHelper.overrideDisplayResize(elementList);
        return _filter(elementList, (element) => {
            let result = true;
            if (_isObject(element)) {
                if (!_isUndefined(element.display?.mobile)
                    && element.display?.mobile !== this.configService.get<boolean>('appConfig.mobile')
                ) {
                    result = false;
                }

                if (result && (element.display?.after || element.display?.before)) {
                    result = result && this.window.matchMedia(this.createMediaQuery(element.display)).matches;
                }

                if (result && !_isUndefined(element.display?.auth)) {
                    result = result
                        && element.display.auth === this.configService.get<boolean>('$user.isAuthenticated');
                }
            }
            return result;
        });
    }

    /**
     * Generate full config for autotests. Not use for general reason.
     * @param full - full or slim mode generation
     * @returns project config
     */
    public async generateFullConfigWithLayouts(
        full: boolean = false,
    ): Promise<Partial<IGlobalConfig> & IIndexing<any>> {

        await this.configService.ready;
        await this.injectionService.importModules([
            'core', 'menu', 'games', 'static', 'promo',
            'user', 'finances', 'bonuses', 'store', 'profile', 'sportsbook', 'livechat']);
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
            const paramsPath: string = params?.childCategory || params?.category || params?.slug;

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
}
