import {
    Directive,
    ElementRef,
    AfterViewInit,
    Input,
} from '@angular/core';
import * as clampLib from 'text-overflow-clamp';

import _ceil from 'lodash-es/ceil';

@Directive({
    selector: '[wlc-clamp]',
})
export class ClampDirective implements AfterViewInit {
    @Input('wlc-clamp') lines: number;

    constructor(
        protected element: ElementRef,
    ) {}

    public ngAfterViewInit(): void {
        if (!this.lines) {
            const styles = window.getComputedStyle(this.element.nativeElement);
            const lineHeight: number = parseInt(styles.lineHeight);
            const height: number = parseInt(styles.height);
            this.lines = _ceil(height/lineHeight);
        }
        clampLib(this.element.nativeElement, this.lines);
    }
}
