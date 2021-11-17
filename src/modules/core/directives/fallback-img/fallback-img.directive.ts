import {
    AfterViewInit,
    Directive,
    ElementRef,
    HostBinding,
    Output,
    EventEmitter,
    Input,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import {
    Subscription,
    fromEvent,
} from 'rxjs';
import {IMediaContent} from 'wlc-engine/modules/games';

import _forEach from 'lodash-es/forEach';

/**
 * @example
 * <img
 *  [src]="image"
 *  [wlc-fallback]="fallbackImage">
 */
@Directive({
    selector: 'img[wlc-fallback]',
})
export class FallbackImgDirective implements AfterViewInit, OnDestroy {

    @Input() @HostBinding('src') protected src: string | IMediaContent[];
    @Input('wlc-fallback') protected wlcFallback: string;
    @Output() imageError = new EventEmitter<void>();

    protected errors$: Subscription;

    constructor(
        protected element: ElementRef,
        protected cdr: ChangeDetectorRef,
    ) {}

    public ngAfterViewInit(): void {
        this.errors$ = fromEvent(this.element.nativeElement, 'error').subscribe(() => {
            this.errors$.unsubscribe();

            if (this.element.nativeElement.parentElement.tagName === 'PICTURE') {
                const sourceElement = this.element.nativeElement.parentElement.querySelectorAll('source');
                _forEach(sourceElement, (elem) => {
                    elem.remove();
                });
            }

            if (this.wlcFallback) {
                this.src = this.wlcFallback;
            } else {
                this.element.nativeElement.style.display = 'none';
            }

            this.imageError.emit();
        });
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.errors$.unsubscribe();
    }
}
