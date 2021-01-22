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
import {FormControl} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

import {
    each as _each,
    find as _find,
    isObject as _isObject,
} from 'lodash';
import {IValidatorSettings} from 'wlc-engine/modules/core';

@Component({
    selector: '[wlc-form-control]',
    templateUrl: './form-control.component.html',
    styleUrls: ['./styles/form-control.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class FormControlComponent implements OnInit, OnDestroy {
    @Input() control: FormControl;
    @Input() className: string;
    @Input() fieldName: string;
    @Input() validators: IValidatorSettings[];
    @HostBinding('class') protected $hostClass: string = 'form-control';

    public errors: string[] = [];

    private ngUnsubscribe = new Subject();

    constructor(
        private cdr: ChangeDetectorRef,
        private translate: TranslateService,
    ) {}

    ngOnInit() {
        this.errors = this.getErrors();
        this.control.statusChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            this.errors = this.getErrors();
            this.cdr.markForCheck();
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    protected getErrors(): string[] {

        return Object.keys(this.control.errors || {}).map((item) => {
            const key = 'validator-' + this.fieldName + '-' + item;

            const validator = _find(this.validators, (validator) => {
                return (_isObject(validator) ? validator['name'] : validator).toLowerCase() === item.toLowerCase();
            });

            if (validator?.text) {
                return gettext(validator.text);
            } else if (this.translate.instant(key) !== key) {
                return key;
            } else {
                return 'validator-' + item;
            }
        });
    }
}
