import {
    Component,
    Inject,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
    AfterViewInit,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {
    IMyDefaultMonth,
    AngularMyDatePickerDirective,
    IMySingleDateModel,
    IMyDateModel,
} from 'angular-mydatepicker';
import {DateTime} from 'luxon';

import {ConfigService} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes';
import * as Params from './datepicker.params';

/**
 * Component datepicker
 *
 * @example
 *
 * {
 *     name: 'core.wlc-datepicker',
 * }
 *
 */
@Component({
    selector: '[wlc-datepicker]',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./styles/datepicker.component.scss'],
})
export class DatepickerComponent extends AbstractComponent implements OnInit, AfterViewInit {
    @Input() protected inlineParams: Params.IDatepickerCParams;
    @ViewChild('mask') mask: ElementRef;
    @ViewChild(AngularMyDatePickerDirective) dp: AngularMyDatePickerDirective;
    public $params: Params.IDatepickerCParams;
    public control: FormControl;
    public locale: string;
    public defaultMonth: IMyDefaultMonth;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IDatepickerCParams,
        protected configService: ConfigService,
        protected translateService: TranslateService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.locale = this.translateService.currentLang;
        this.control = this.$params.control || new FormControl('');
        const disableSince = this.$params.datepickerOptions.disableSince;

        this.defaultMonth = this.$params.defaultMonth || {
            defMonth: !!disableSince
                ? DateTime.fromObject(disableSince).toFormat('LL/yyyy')
                : DateTime.local().toFormat('LL/yyyy'),
            overrideSelection: false,
        };
    }

    public onDateChanged(date: IMyDateModel): void {
        this.mask?.nativeElement?.mask.updateValue();
        // TODO functional for range. Are we going to use range?
        let dateTime = DateTime.fromJSDate(date.singleDate.jsDate);
        if (this.$params.name === 'endDate') {
            dateTime = dateTime.endOf('day');
        }
        this.control.setValue(dateTime);
        this.control.markAllAsTouched();
        this.cdr.markForCheck();
    }

    public ngAfterViewInit(): void {
        if (this.control.value) {
            this.dp.writeValue({
                singleDate: this.dateToSingleDPModel(this.control.value),
            });
        }
    }

    protected dateToSingleDPModel(date: DateTime): IMySingleDateModel {
        return {jsDate: date.toJSDate()};
    }
}
