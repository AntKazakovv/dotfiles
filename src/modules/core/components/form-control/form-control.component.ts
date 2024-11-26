import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

import {ValidatorType} from 'wlc-engine/modules/core/system/services/validation/validation.service';

import _isObject from 'lodash-es/isObject';
import _toString from 'lodash-es/toString';

@Component({
    selector: '[wlc-form-control]',
    templateUrl: './form-control.component.html',
    styleUrls: ['./styles/form-control.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class FormControlComponent implements OnInit, OnDestroy {
    @Input() control: UntypedFormControl;
    @Input() className: string;
    @Input() fieldName: string;
    @Input() validators: ValidatorType[];
    @Input() validatorsAnyOf: ValidatorType[];
    @HostBinding('class') protected $hostClass: string = 'form-control';

    public errors: string[] = [];

    private ngUnsubscribe = new Subject();

    constructor(
        private cdr: ChangeDetectorRef,
        private translateService: TranslateService,
    ) {
    }

    public ngOnInit(): void {
        if (!this.control) {
            return;
        }

        this.errors = this.getErrors();
        this.control.statusChanges.pipe(
            takeUntil(this.ngUnsubscribe),
        ).subscribe(() => {
            this.errors = this.getErrors();
            if (this.control.errors && !this.errors.length) {
                this.control.setErrors(null);
            }
            this.cdr.markForCheck();
        });
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }

    public get isValueEmpty(): boolean {
        return !_toString(this.control.value).length;
    }

    protected getErrors(): string[] {
        const validatorsErrors: string[] = [];
        const validatorsAnyOfErrors: string[] = [];

        if (this.control.errors !== null) {
            Object.keys(this.control.errors).forEach((item: string): void => {
                if (this.validatorsAnyOf?.includes(item)) {
                    validatorsAnyOfErrors.push(item);
                } else {
                    validatorsErrors.push(item);
                }
            });
        }

        if (validatorsErrors.length) {
            return this.errorHandling(validatorsErrors);
        } else if (validatorsAnyOfErrors.length === this.validatorsAnyOf?.length) {
            return [gettext('Check the correctness of the filled-out fields')];
        }

        return [];
    }

    protected errorHandling(errors: string[]): string[] {
        return errors.map((item: string): string => {
            if (item === 'incomingError') {
                return this.control.errors[item];
            }

            const key = `validator-${this.fieldName}-${item}`;

            const validator = this.validators.find((validator) => {
                return (_isObject(validator) ? validator['name'] : validator).toLowerCase() === item.toLowerCase();
            });

            if (_isObject(validator) && validator.text) {
                return gettext(validator.text);
            } else if (this.translateService.instant(key) !== key) {
                return key;
            } else {
                return `validator-${item}`;
            }
        });
    }
}
