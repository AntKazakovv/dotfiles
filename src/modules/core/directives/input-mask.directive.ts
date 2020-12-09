import {Directive, ElementRef, AfterViewInit, Input, HostBinding} from '@angular/core';
import IMask from 'imask';
import {IIndexing} from 'wlc-engine/interfaces';

import {
    assign as _assign,
} from 'lodash';

/**
 * See more: [imask docs]{@link https://imask.js.org/}.
*/
export interface IMaskOptions {
    mask: string | DateConstructor | Number;
    min?: string | Date | number;
    max?: string | Date | number;
    lazy?: boolean;
    placeholderChar?: string;
    blocks?: IIndexing<IMaskOptions>;
    autofix?: boolean;
    from?: number;
    to?: number;
    maxLengthL?: number;
    enum?: string[];
    pattern?: string;
    format?: (date: Date) => string;
    parse?: (string: string) => Date;
    overwrite?: boolean;
}

@Directive({
    selector: '[wlc-input-mask]',
})
export class InputMaskDirective implements AfterViewInit {
    @Input('wlc-input-mask') wlcInputMask: any;
    @HostBinding('class') class: string;

    constructor(
        protected element: ElementRef,
    ) {}

    public ngAfterViewInit(): void {
        const mask = IMask(this.element.nativeElement, this.wlcInputMask);
        this.setClass(mask.masked.rawInputValue);
        _assign(this.element.nativeElement, {mask});

        mask.on('accept', () => {
            this.setClass(mask.masked.rawInputValue);
        });
    }

    private setClass(rawInputValue: string): void {
        this.class = rawInputValue.length ? '' : 'blank-mask';
    }
}
