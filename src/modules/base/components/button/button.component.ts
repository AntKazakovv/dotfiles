import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    Renderer2,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import {Subject} from 'rxjs';
import {
    filter,
    startWith,
    takeUntil,
} from 'rxjs/operators';
import {IconComponent} from '../icon/icon.component';

import {
    forEach as _forEach,
} from 'lodash';

export type NzButtonType = 'default' | 'primary' | 'accent' | 'warn' | 'danger' | 'link' | 'text' | null;
export type NzButtonSize = 'large' | 'default' | 'small';

@Component({
    selector: `button[wlc-button], a[wlc-button]`,
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.wlc-btn]': `true`,
        '[class.wlc-btn-primary]': `wlcBtnType === 'primary'`,
        '[class.wlc-btn-accent]': `wlcBtnType === 'accent'`,
        '[class.wlc-btn-warn]': `wlcBtnType === 'warn'`,
        '[class.wlc-btn-link]': `wlcBtnType === 'link'`,
        '[class.wlc-btn-text]': `wlcBtnType === 'text'`,
        '[class.wlc-btn-lg]': `wlcBtnSize === 'large'`,
        '[class.wlc-btn-sm]': `wlcBtnSize === 'small'`,
        '[class.wlc-btn-dangerous]': `wlcBtnDanger`,
        '[class.wlc-btn-loading]': `wlcBtnLoading`,
        '[attr.tabindex]': 'disabled ? -1 : (tabIndex === null ? null : tabIndex)',
        '[attr.disabled]': 'disabled || null',
        '(click)': 'clickAnimation($event)'
    }
})
export class ButtonComponent implements OnChanges, OnDestroy, AfterContentInit, AfterViewInit {

    @ContentChild(IconComponent, { read: ElementRef }) IconComponentElement!: ElementRef;
    @Input() wlcBtnIcon: boolean = false;
    @Input() wlcBtnLoading: boolean = false;
    @Input() disabled: boolean = false;
    @Input() tabIndex: number | string | null = null;
    @Input() wlcBtnType: NzButtonType = null;
    @Input() wlcBtnSize: NzButtonSize = 'default';

    protected destroy$ = new Subject<void>();
    protected loading$ = new Subject<boolean>();

    constructor(
        protected elementRef: ElementRef,
        protected renderer: Renderer2,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        const {wlcBtnLoading} = changes;

        if (wlcBtnLoading) {
            this.loading$.next(this.wlcBtnLoading);
        }
    }

    ngAfterContentInit(): void {
        this.loading$
            .pipe(
                startWith(this.wlcBtnLoading),
                filter(() => !!this.IconComponentElement),
                takeUntil(this.destroy$)
            )
            .subscribe((loading: boolean) => {
                const nativeElement = this.IconComponentElement.nativeElement;
                if (loading) {
                    this.renderer.setStyle(nativeElement, 'display', 'none')
                } else {
                    this.renderer.removeStyle(nativeElement, 'display')
                }
            })
    }

    ngAfterViewInit(): void {
        this.assertIconOnly(this.elementRef.nativeElement, this.renderer);
        this.insertSpan(this.elementRef.nativeElement.childNodes, this.renderer);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    protected clickAnimation(event: Event): void {
        if (this.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        } else {
            this.elementRef.nativeElement.classList.add('wlc-btn-click');
            setTimeout(() => {
                this.elementRef.nativeElement.classList.remove('wlc-btn-click');
            }, 700)
        }
    }

    protected insertSpan(nodes: NodeList, renderer: Renderer2): void {
        _forEach(nodes, (node: HTMLElement) => {
            if (node.nodeName === '#text') {
                const span = renderer.createElement('span');
                span.classList.add('wlc-btn__text');
                const parent = renderer.parentNode(node);
                renderer.insertBefore(parent, span, node);
                renderer.appendChild(span, node);
            }
        })
    }

    protected assertIconOnly(element: HTMLButtonElement, renderer: Renderer2): void {
        const listOfNode = Array.from(element.childNodes);
        const iconCount = listOfNode.filter(node => node.nodeName === 'I').length;
        const noText = listOfNode.every(node => node.nodeName !== '#text');
        const noSpan = listOfNode.every(node => node.nodeName !== 'SPAN');
        const isIconOnly = noSpan && noText && iconCount >= 1;
        if (isIconOnly) {
            renderer.addClass(element, 'wlc-btn-icon-only');
        }
    }
}
