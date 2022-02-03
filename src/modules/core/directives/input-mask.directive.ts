import {
    Directive,
    ElementRef,
    Input,
    OnDestroy,
    AfterViewInit,
    OnChanges,
    ChangeDetectorRef,
    SimpleChanges,
    Injector,
} from '@angular/core';
import {NgControl} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {
    fromEvent,
    Subject,
} from 'rxjs';
import IMask, {AnyMaskedOptions, InputMask} from 'imask';

import _isString from 'lodash-es/isString';
import _assign from 'lodash-es/assign';
import _isObject from 'lodash-es/isObject';

import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

/**
 * See more: [imask docs]{@link https://imask.js.org/}.
 */
export interface IMaskOptions {
    mask: string | DateConstructor | Number | RegExp | IMask.AnyMask;
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
export class InputMaskDirective implements AfterViewInit, OnChanges, OnDestroy {
    @Input('wlc-input-mask') wlcInputMask: AnyMaskedOptions | string;
    protected mask: InputMask<AnyMaskedOptions>;
    protected ngControl: NgControl;
    protected $destroy: Subject<null> = new Subject();

    constructor(
        protected element: ElementRef,
        protected cdr: ChangeDetectorRef,
        protected injector: Injector,
    ) {
    }

    public ngAfterViewInit(): void {
        this.getPattern(this.wlcInputMask);

        if (_isObject(this.wlcInputMask) && this.wlcInputMask.mask) {

            if (!this.mask) {
                this.mask = IMask(this.element.nativeElement, this.wlcInputMask);
                _assign(this.element.nativeElement, {mask: this.mask});
            }

            try {
                this.ngControl = this.injector.get(NgControl);
                this.ngControl.control.valueChanges
                    .pipe(takeUntil(this.$destroy))
                    .subscribe((value) => {
                        if (value === '') {
                            this.mask.updateValue();
                        }
                    });
            } catch {
                fromEvent(this.element.nativeElement, 'keyup')
                    .pipe(takeUntil(this.$destroy))
                    .subscribe(() => {
                        this.element.nativeElement.value = this.mask.value;
                        this.element.nativeElement.dispatchEvent(new Event('input'));
                    });
            }
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.getPattern(this.wlcInputMask);

        if (!this.mask && _isObject(this.wlcInputMask) && this.wlcInputMask.mask) {
            this.mask = IMask(this.element.nativeElement, this.wlcInputMask);
            _assign(this.element.nativeElement, {mask: this.mask});
        }

        setTimeout(() => {
            this.element.nativeElement?.mask?.updateOptions(changes.wlcInputMask?.currentValue);
            this.cdr.detectChanges();
        });
    }

    public ngOnDestroy(): void {
        this?.mask?.destroy();
        this.$destroy.next();
        this.$destroy.complete();
    }

    public getPattern(pattern: AnyMaskedOptions | string): void {
        if (_isString(pattern)) {
            switch (pattern) {
                case 'textField': {
                    this.wlcInputMask = {
                        mask: /^[A-zЁА-яё][\sA-zЁА-яё\-]{0,49}$/,
                    };
                    break;
                }
                default:
                    this.wlcInputMask = null;
                    break;
            }
        }
    }
}
