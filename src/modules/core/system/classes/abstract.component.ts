import {
    ChangeDetectorRef,
    HostBinding,
    OnDestroy,
    OnInit,
    OnChanges,
    SimpleChanges,
    Directive,
} from '@angular/core';
import {Subject} from 'rxjs';

import {ActionService} from 'wlc-engine/modules/core/system/services/action/action.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';

import _filter from 'lodash-es/filter';
import _get from 'lodash-es/get';
import _isArray from 'lodash-es/isArray';
import _map from 'lodash-es/map';
import _union from 'lodash-es/union';
import _forEach from 'lodash-es/forEach';
import _cloneDeep from 'lodash-es/cloneDeep';
import _split from 'lodash-es/split';
import _has from 'lodash-es/has';
import _mergeWith from 'lodash-es/mergeWith';
import _includes from 'lodash-es/includes';

export {IComponentParams, CustomType} from 'wlc-engine/modules/core';

interface IAbstractConfig {
    moduleName?: string;
    componentName?: string;
}

export interface IMixedParams<T extends IComponentParams<unknown, unknown, unknown>> {
    defaultParams: T;
    injectParams: T;
    inlineParams?: T;
    moduleName?: string;
    componentName?: string;
}

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class AbstractComponent implements OnDestroy, OnInit, OnChanges {
    @HostBinding('class') protected $hostClass: string;
    @HostBinding('attr.data-wlc-element') protected $hostWlcElement: string;
    public $class: string;
    public $params: unknown & IComponentParams<unknown, unknown, unknown>;

    protected $destroy: Subject<void> = new Subject();
    protected modifiers: string[] = [];
    protected cdr: ChangeDetectorRef;

    constructor(
        private mixedParams: IMixedParams<unknown>,
        protected ConfigService?: ConfigService,
        protected actionService?: ActionService,
    ) {
    }

    public ngOnInit(inlineParams?: IComponentParams<unknown, unknown, unknown>): void {
        const abstractConfig: IAbstractConfig = _cloneDeep(this.mixedParams.defaultParams);
        this.$params = _mergeWith(
            abstractConfig,
            this.ConfigService?.get<IIndexing<unknown>>(
                `$modules.${abstractConfig?.moduleName}.components.${abstractConfig?.componentName}`,
            ),
            !inlineParams ? this.mixedParams.injectParams : {},
            inlineParams,
            (objValue: unknown, srcValue: unknown) => _isArray(objValue) ? srcValue : undefined,
        );

        if (_get(this, 'type')) {
            this.$params.type = _get(this, 'type');
        }
        if (_get(this, 'theme')) {
            this.$params.theme = _get(this, 'theme');
        }
        if (_get(this, 'themeMod')) {
            this.$params.themeMod = _get(this, 'themeMod');
        }
        if (_get(this, 'customMod')) {
            this.$params.customMod = _get(this, 'customMod');
        }
        this.$class = this.$params?.class;
        if (this.$params.customMod) {
            this.modifiers = (_isArray(this.$params.customMod)) ? this.$params.customMod : _split(this.$params.customMod, ' ');
        }

        this.prepareHostClass();
        this.setWlcElementOnHost();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (_get(changes, 'inlineParams.currentValue') && _get(this, 'inlineParams')) {
            _mergeWith(this.$params, _get(changes, 'inlineParams.currentValue'), (objValue, srcValue) => {
                if (_isArray(objValue)) {
                    return srcValue;
                }
            });
        }
    }

    public ngOnDestroy() {
        this.$destroy.next();
        this.$destroy.complete();
    }

    public getParam<T>(path: string): T {
        return _get(this.$params, path) as T;
    }

    public paramInclude(paramName: string, classes: string | string[]): boolean {
        if (_isArray(classes)) {
            return _includes(classes, this.$params[paramName]);
        } else {
            return this.$params[paramName] === classes;
        }
    }

    public paramExclude(paramName: string, classes: string | string[]): boolean {
        if (_isArray(classes)) {
            return !_includes(classes, this.$params[paramName]);
        } else {
            return this.$params[paramName] !== classes;
        }
    }

    protected prepareHostClass(): void {
        this.modifiers = _union(this.modifiers, [(this.$params.type) ? `type-${this.$params.type}` : 'type-default']);
        this.modifiers = _union(this.modifiers, [(this.$params.theme) ? `theme-${this.$params.theme}` : 'theme-default']);
        this.modifiers = _union(this.modifiers, [(this.$params.themeMod) ? `theme-mod-${this.$params.themeMod}` : 'theme-mod-default']);
        const preparedModifiers = _map(this.modifiers, (mod: string): string => `${this.$class}--${mod}`);
        this.$hostClass = [this.$class, ...preparedModifiers].join(' ');
        this.cdr?.markForCheck();
    }

    protected setWlcElementOnHost(): void {
        this.$hostWlcElement = this.$params.wlcElement
            || (this.$params.class || this.$params.componentName);
    }

    protected addModifiers(mods: string[] | string): void {
        const modifiers = _union(this.modifiers, _isArray(mods) ? mods : [mods]);
        this.setModifiers(modifiers);
    }

    protected removeModifiers(mods: string[] | string): void {
        const modifiers = _filter(this.modifiers, (mod) => {
            return _isArray(mods) ? !mods.includes(mod) : mods !== mod;
        });
        this.setModifiers(modifiers);
    }

    protected setModifiers(mods: string[] | string): any {
        this.modifiers = _isArray(mods) ? mods : [mods];
        this.prepareHostClass();
    }

    protected clearModifiers(): void {
        this.modifiers.length = 0;
        this.prepareHostClass();
    }

    protected toggleModifiers(mods: string[] | string): void {
        if (_isArray(mods)) {
            _forEach(mods, (mod: string): void => {
                if (this.hasModifier(mod)) {
                    this.removeModifiers(mod);
                } else {
                    this.addModifiers(mod);
                }
            });
        } else {
            if (this.hasModifier(mods)) {
                this.removeModifiers(mods);
            } else {
                this.addModifiers(mods);
            }
        }
    }

    protected hasModifier(mod: string): boolean {
        return this.modifiers.includes(mod);
    }

    protected hasParam(path: string): boolean {
        return _has(this.$params, path);
    }
}
