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
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {TranslateService} from '@ngx-translate/core';

import {
    each as _each,
} from 'lodash';

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
            if (this.translate.instant(key) !== key) {
                return key;
            } else {
                return 'validator-' + item;
            }
        });
    }
}
