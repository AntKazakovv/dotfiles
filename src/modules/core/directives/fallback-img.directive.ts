import {
    AfterViewInit,
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
    Output,
    EventEmitter,
    Input,
    OnDestroy,
} from '@angular/core';
import {
    Subscription,
    fromEvent,
} from 'rxjs';

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

    @Input() @HostBinding('src') protected src: string;
    @Input('wlc-fallback') protected wlcFallback: string;
    @Output() imageError = new EventEmitter<void>();

    protected errors$: Subscription;

    constructor(
        protected element: ElementRef,
    ) {}

    public ngAfterViewInit(): void {

        this.errors$ = fromEvent(this.element.nativeElement, 'error').subscribe((event: Event) => {
            this.imageError.emit();

            if (this.wlcFallback) {
                this.src = this.wlcFallback;
            } else {
                this.element.nativeElement.style.display = 'none';
            }
        });
    }

    public ngOnDestroy(): void {
        this.errors$.unsubscribe();
    }
}
