import {
    AfterViewInit,
    Directive,
    ElementRef,
    Input,
} from '@angular/core';

import {SwiperOptions} from 'swiper/types/swiper-options';
import {SwiperContainer} from 'swiper/element';

@Directive({
    selector: '[wlc-swiper]',
})
export class SwiperDirective implements AfterViewInit {
    @Input() config?: SwiperOptions;

    constructor(private element: ElementRef<SwiperContainer>) {}

    public ngAfterViewInit(): void {
        Object.assign(this.element.nativeElement, this.config);
        this.element.nativeElement.initialize();
    }
}
