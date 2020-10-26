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
    styleUrls: ['./button.component.scss'],
    preserveWhitespaces: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent extends AbstractComponent implements OnInit, OnChanges, OnDestroy, AfterContentInit, AfterViewInit {

    @ContentChild(IconComponent, {read: ElementRef}) IconComponentElement!: ElementRef;
    @Input() protected disabled: boolean;
    @Input() protected icon: string;
    @Input() protected index: BParams.ButtonIndex;
    @Input() protected loading: boolean;
    @Input() protected additionalModifiers: BParams.ManualModifiersType
    @Input() protected size: BParams.ButtonSize;
    @Input() public text: string;
    @Input() protected type: BParams.ButtonTheme;

    public $params: BParams.IBParams;

    protected $loading = new Subject<boolean>();

    constructor(
        protected elementRef: ElementRef,
        protected renderer: Renderer2,
        @Inject('injectParams') protected params: BParams.IBParams,
        protected cdr: ChangeDetectorRef,
    ) {
        super(<IMixedParams<BParams.IBParams>>{injectParams: params, defaultParams: BParams.defaultParams});
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.prepareParams();
        this.prepareModifiers();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const {wlcBtnLoading} = changes;

        if (wlcBtnLoading) {
            this.$loading.next(this.loading);
        }
    }

    ngAfterContentInit(): void {
        // this.loading$
        //     .pipe(
        //         startWith(this.loading),
        //         filter(() => !!this.IconComponentElement),
        //         takeUntil(this.$destroy),
        //     )
        //     .subscribe((loading: boolean) => {
        //         const nativeElement = this.IconComponentElement.nativeElement;
        //         if (loading) {
        //             this.renderer.setStyle(nativeElement, 'display', 'none')
        //         } else {
        //             this.renderer.removeStyle(nativeElement, 'display')
        //         }
        //     });
    }

    public ngAfterViewInit(): void {
        // this.assertIconOnly(this.elementRef.nativeElement, this.renderer);
    }

    protected prepareParams(): void {
        const importParams: BParams.IBParams = {
            common: {},
        };
        if (this.type) {
            importParams.type = this.type;
        }
        if (this.size) {
            importParams.common.size = this.size;
        }
        if (this.icon) {
            importParams.common.icon = this.icon;
        }
        if (this.loading === true || this.loading === false) {
            importParams.common.loading = this.loading;
        }
        if (this.disabled === true || this.disabled === false) {
            importParams.common.disabled = this.disabled;
        }
        if (this.index !== undefined) {
            importParams.common.index = this.index;
        }
        if (this.text !== undefined) {
            importParams.common.text = this.text;
        }
        if (this.additionalModifiers) {
            importParams.common.additionalModifiers = this.additionalModifiers;
        }
        this.$params = _merge(this.$params, importParams);
    }

    protected prepareModifiers(): void {
        let modifiers: BParams.ModifiersType[] = [];
        modifiers.push(this.$params.common.size);
        if (this.$params.common.loading) {
            modifiers.push('loading');
        }
        if (this.$params.common.additionalModifiers) {
            modifiers = _union(modifiers, this.$params.common.additionalModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }

    protected assertIconOnly(element: HTMLButtonElement, renderer: Renderer2): void {
        // const listOfNode = Array.from(element.childNodes);
        // const iconCount = listOfNode.filter(node => node.nodeName === 'I').length;
        // const noText = listOfNode.every(node => node.nodeName !== '#text');
        // const noSpan = listOfNode.every(node => node.nodeName !== 'SPAN');
        // const isIconOnly = noSpan && noText && iconCount >= 1;
        // if (isIconOnly) {
        //     renderer.addClass(element, 'wlc-btn-icon-only');
        // }
    }
}
