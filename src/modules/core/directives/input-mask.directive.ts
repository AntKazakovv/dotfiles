import {Directive, ElementRef, Input, OnDestroy, AfterViewInit} from '@angular/core';
import IMask, {InputMask} from 'imask';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

import {
    assign as _assign,
} from 'lodash-es';

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
export class InputMaskDirective implements AfterViewInit, OnDestroy {
    @Input('wlc-input-mask') wlcInputMask: IMask.AnyMaskedOptions;
    protected mask: InputMask<IMask.AnyMaskedOptions>;

    constructor(
        protected element: ElementRef,
    ) {}

    public ngAfterViewInit(): void {
        this.mask = IMask(this.element.nativeElement, this.wlcInputMask);
        _assign(this.element.nativeElement, {mask: this.mask});
    }

    public ngOnDestroy(): void {
        this?.mask.destroy();
    }
}
