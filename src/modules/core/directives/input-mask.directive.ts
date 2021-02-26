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
export class InputMaskDirective implements AfterViewInit,
    OnChanges,
    OnDestroy {
    @Input('wlc-input-mask') wlcInputMask: IMask.AnyMaskedOptions;
    protected mask: InputMask<IMask.AnyMaskedOptions>;

    constructor(
        protected element: ElementRef,
        protected cdr: ChangeDetectorRef,
    )
    {
    }

    public ngAfterViewInit(): void {
        if (this.wlcInputMask) {
            this.mask = IMask(this.element.nativeElement, this.wlcInputMask);
            _assign(this.element.nativeElement, {mask: this.mask});
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.element.nativeElement?.mask?.updateOptions(_get(changes, 'wlcInputMask.currentValue'));
        this.cdr.detectChanges();
    }

    public ngOnDestroy(): void {
        this?.mask?.destroy();
    }
}
