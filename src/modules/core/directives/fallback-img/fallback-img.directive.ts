import {
    AfterViewInit,
    Directive,
    ElementRef,
    HostBinding,
    Output,
    EventEmitter,
    Input,
    ChangeDetectorRef,
    Renderer2,
    OnDestroy,
} from '@angular/core';

import _forEach from 'lodash-es/forEach';

import {IMediaContent} from 'wlc-engine/modules/games';

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

    private listener: () => void;

    constructor(
        protected renderer: Renderer2,
        protected element: ElementRef,
        protected cdr: ChangeDetectorRef,
    ) {}

    public ngAfterViewInit(): void {
        this.listener = this.renderer.listen(this.element.nativeElement, 'error', (event: Event): void => {
            const eventTarget: HTMLElement = event.target as HTMLElement;

            if (eventTarget.tagName === 'PICTURE') {
                const sourceElement: HTMLSourceElement[] =
                    this.renderer.parentNode(eventTarget)?.querySelectorAll('source');

                _forEach(sourceElement, (elem: HTMLSourceElement): void => {
                    this.renderer.removeChild(this.renderer.parentNode(eventTarget), elem);
                });
            }

            if (this.wlcFallback) {
                this.src = this.wlcFallback;
            } else {
                this.renderer.setStyle(this.element.nativeElement, 'display', 'none');
            }

            this.imageError.emit();
            this.cdr.markForCheck();
        });
    }

    public ngOnDestroy(): void {
        if (this.listener) {
            this.listener();
        }
    }
}
