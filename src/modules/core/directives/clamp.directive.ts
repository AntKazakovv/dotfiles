import {
    Directive,
    ElementRef,
    AfterViewInit,
    Input,
} from '@angular/core';
import * as clampLib from 'text-overflow-clamp';

@Directive({
    selector: '[wlc-clamp]',
})
export class ClampDirective implements AfterViewInit {
    @Input('wlc-clamp') lines: number;

    constructor(
        protected element: ElementRef,
    ) {}

    public ngAfterViewInit(): void {
        clampLib(this.element.nativeElement, this.lines);
    }
}
