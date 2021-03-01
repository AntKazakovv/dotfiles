import {
    Directive,
    ElementRef,
    Input,
    OnDestroy,
    AfterViewInit,
    OnChanges,
    ChangeDetectorRef,
    SimpleChanges,
} from '@angular/core';
import IMask, {InputMask} from 'imask';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

import {
    assign as _assign,
    get as _get,
    isString as _isString,
} from 'lodash-es';

/**
 * See more: [imask docs]{@link https://imask.js.org/}.
 */
export interface IMaskOptions {
    mask: string | DateConstructor | Number | RegExp;
    min?: string | Date | number;
    max?: string | Date | number;
    lazy?: boolean;
    placeholderChar?: string;
    blocks?: IIndexing<IMaskOptions>;
    autofix?: boolean;
    from?: number;
    to?: number;
    maxLength?: number;
    enum?: string[];
    pattern?: string;
    format?: (date: Date) => string;
    parse?: (string: string) => Date;
    overwrite?: boolean;
}

@Directive({
    selector: '[wlc-input-mask]',
})
export class InputMaskDirective implements AfterViewInit,
    OnChanges,
    OnDestroy {
    @Input('wlc-input-mask') wlcInputMask: IMaskOptions | string;
    protected mask: InputMask<IMask.AnyMaskedOptions>;

    constructor(
        protected element: ElementRef,
        protected cdr: ChangeDetectorRef,
    ) {
    }

    public ngAfterViewInit(): void {
        this.getPattern(this.wlcInputMask);

        if (this.wlcInputMask) {
            this.mask = IMask(this.element.nativeElement, this.wlcInputMask as IMask.AnyMaskedOptions);
            _assign(this.element.nativeElement, {mask: this.mask});
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.wlcInputMask.currentValue.mask || this.wlcInputMask) {
            this.getPattern(changes.wlcInputMask.currentValue.mask);
            this.element.nativeElement?.mask?.updateOptions(this.wlcInputMask);
            this.cdr.detectChanges();
        }
    }

    public ngOnDestroy(): void {
        this?.mask?.destroy();
    }

    public getPattern(pattern: IMaskOptions | string): void {
        if (_isString(pattern)) {
            switch (pattern) {
                case 'textField': {
                    this.wlcInputMask = {
                        mask: /^[a-zA-zА-Яа-яёЁ][a-zA-zА-Яа-яёЁ\s\-]{0,50}$/,
                    };
                    break;
                }
            }
        }
        return;
    }
}
