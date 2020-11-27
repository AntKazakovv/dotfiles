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
    @HostBinding('class') protected $hostClass: string = 'form-control';
    private ngUnsubscribe = new Subject();

    constructor(
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.control.statusChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            this.cdr.markForCheck();
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
