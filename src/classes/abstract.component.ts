import {ChangeDetectorRef, HostBinding, OnDestroy} from '@angular/core';
import {
    filter as _filter,
    get as _get,
    isArray as _isArray,
    map as _map,
    merge as _merge,
    union as _union,
    forEach as _forEach,
} from 'lodash';
import {Subject} from 'rxjs';

import {IComponentParams} from 'wlc-engine/interfaces/config.interface';

export {IComponentParams} from 'wlc-engine/interfaces/config.interface';

export interface IMixedParams<T extends IComponentParams> {
    defaultParams: T;
    params: T;
}

export class AbstractComponent implements OnDestroy {
    @HostBinding('class') protected $hostClass: string;
    public $class: string;
    public $params: unknown & IComponentParams;

    protected $destroy: Subject<void> = new Subject();
    protected modifiers: string[] = [];
    protected cdr: ChangeDetectorRef;

    constructor(
        private mixedParams: IMixedParams<unknown>,
        // private root?: ViewContainerRef
    ) {
        this.$params = _merge(mixedParams.defaultParams, mixedParams.params);
        this.$class = this.$params?.class;
        this.modifiers = this.$params?.modifiers || [];
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
}
