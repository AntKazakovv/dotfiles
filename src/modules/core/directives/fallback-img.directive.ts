import {
    Directive,
    Input,
    HostBinding,
    HostListener,
} from '@angular/core';

/**
 * @example
 * <img
 *  [src]="image"
 *  [wlc-fallback]="fallbackImage">
 */

@Directive({
    selector: 'img[wlc-fallback]',
})
export class FallbackImgDirective {
    @Input()
    @HostBinding('src')
    protected src: string;

    @Input('wlc-fallback')
    protected wlcFallback: string;

    @HostListener('error')
    onError() {
        this.src = this.wlcFallback;
    }
}
