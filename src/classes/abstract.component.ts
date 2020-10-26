import {ChangeDetectorRef, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {
    filter as _filter,
    get as _get,
    isArray as _isArray,
    map as _map,
    merge as _merge,
    union as _union,
    forEach as _forEach,
    findIndex as _findIndex,
    cloneDeep as _cloneDeep,
    has as _has,
    split as _split,
} from 'lodash';
import {Subject} from 'rxjs';

import {IComponentParams} from 'wlc-engine/interfaces/config.interface';

export {IComponentParams, Custom} from 'wlc-engine/interfaces/config.interface';

export interface IMixedParams<T extends IComponentParams<unknown, unknown, unknown>> {
    defaultParams: T;
    injectParams: T;
    inlineParams?: T;
}

export class AbstractComponent implements OnDestroy, OnInit {
    @HostBinding('class') protected $hostClass: string;
    public $class: string;
    public $params: unknown & IComponentParams<unknown, unknown, unknown>;

    protected $destroy: Subject<void> = new Subject();
    protected modifiers: string[] = [];
    protected cdr: ChangeDetectorRef;

    constructor(
        private mixedParams: IMixedParams<unknown>,
    ) {
    }

    public ngOnInit(inlineParams?: IComponentParams<unknown, unknown, unknown>): void {
        this.$params = _merge(
            _cloneDeep(this.mixedParams.defaultParams),
            !inlineParams ? this.mixedParams.injectParams : {},
            inlineParams,
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
    }

    public ngOnDestroy() {
        this.$destroy.next();
        this.$destroy.complete();
    }

    public getParam<T>(path: string): T {
        return _get(this.$params, path) as T;
    }

    protected prepareHostClass(): void {
        this.modifiers = _union(this.modifiers, [(this.$params.type) ? `type-${this.$params.type}` : 'type-default']);
        this.modifiers = _union(this.modifiers, [(this.$params.theme) ? `theme-${this.$params.theme}` : 'theme-default']);
        this.modifiers = _union(this.modifiers, [(this.$params.themeMod) ? `theme-mod-${this.$params.themeMod}` : 'theme-mod-default']);
        const preparedModifiers = _map(this.modifiers, (mod: string): string => `${this.$class}--${mod}`);
        this.$hostClass = [this.$class, ...preparedModifiers].join(' ');
        this.cdr?.markForCheck();
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
        return;
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
