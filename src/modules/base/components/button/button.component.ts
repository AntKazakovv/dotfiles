import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef, Inject,
    Input,
    OnChanges,
    OnDestroy,
    Renderer2,
    SimpleChanges,
    OnInit,
} from '@angular/core';
import {Subject} from 'rxjs';
import {
    filter,
    startWith,
    takeUntil,
} from 'rxjs/operators';
import {IconComponent} from '../icon/icon.component';
import {AbstractComponent, IMixedParams} from 'wlc-engine/classes/abstract.component';
import * as BParams from './button.params';


import {
    merge as _merge,
    isString as _isString,
    union as _union,
} from 'lodash';

@Component({
    selector: 'button[wlc-button]',
    templateUrl: './button.component.html',
    styleUrls: ['./styles/button.component.scss'],
    preserveWhitespaces: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent extends AbstractComponent implements OnInit, OnChanges, OnDestroy, AfterContentInit, AfterViewInit {

    @ContentChild(IconComponent, {read: ElementRef}) IconComponentElement!: ElementRef;
    @Input() public text: string;
    @Input() protected type: BParams.Type;
    @Input() protected theme: BParams.Theme;
    @Input() protected themeMod: BParams.ThemeMod;
    @Input() protected customMod: BParams.CustomMod
    @Input() protected size: BParams.Size;
    @Input() protected icon: string;
    @Input() protected index: BParams.Index;

    public $params: BParams.IBParams;
    protected $loading = new Subject<boolean>();

    constructor(
        protected elementRef: ElementRef,
        @Inject('injectParams') protected params: BParams.IBParams,
        protected cdr: ChangeDetectorRef,
    ) {
        super(<IMixedParams<BParams.IBParams>>{injectParams: params, defaultParams: BParams.defaultParams});
    }

    ngOnInit(): void {
        super.ngOnInit(this.prepareParams());
        this.prepareModifiers();
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    ngAfterContentInit(): void {
    }

    public ngAfterViewInit(): void {
    }

    protected prepareParams(): BParams.IBParams {
        const inlineParams: BParams.IBParams = {
            common: {},
        };
        if (this.size) {
            inlineParams.common.size = this.size;
        }
        if (this.icon) {
            inlineParams.common.icon = this.icon;
        }
        if (this.index !== undefined) {
            inlineParams.common.index = this.index;
        }
        if (this.text !== undefined) {
            inlineParams.common.text = this.text;
        }
        return inlineParams;
    }

    protected prepareModifiers(): void {
        let modifiers: BParams.Modifiers[] = [];
        if (this.$params.common.size) {
            modifiers.push(`size-${this.$params.common.size}`);
        }
        if (this.$params.common.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }
}
