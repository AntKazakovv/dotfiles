import {
    Directive,
    ElementRef,
    AfterViewInit,
    Input,
} from '@angular/core';
import {
    isString as _isString,
} from 'lodash-es';

@Directive({
    selector: '[wlc-value-length]',
})
export class ValueLengthDirective implements AfterViewInit {
    @Input('wlc-value-length') text: unknown;
    @Input() minLength: number;
    @Input() maxLength: number;

    constructor(
        protected element: ElementRef,
    ) {}

    public ngAfterViewInit(): void {
        const nativeElem = (this.element.nativeElement as HTMLElement);
        if (this.text) {
            const strLength =  _isString(this.text) ? this.text.length : this.text.toString().length;

            if (strLength > this.minLength && strLength < this.maxLength) {
                nativeElem.classList.add('wlc-small');
            } else if (strLength >= this.maxLength) {
                nativeElem.classList.add('wlc-smaller');
            }
        }
    }
}
