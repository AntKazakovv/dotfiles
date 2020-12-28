import {
    Directive,
    Input,
    HostBinding,
    HostListener,
} from '@angular/core';

@Directive({
    selector: 'img[fallback]',
})
export class FallbackImgDirective {
    @Input()
    @HostBinding('src') protected src: string;

    @Input() protected fallback: string;

    @HostListener('error')
    onError() {
        this.src = this.fallback;
    }
}
