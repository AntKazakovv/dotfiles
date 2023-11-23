import {
    Component,
    Inject,
    OnInit,
    Input,
    ViewChild,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {takeUntil} from 'rxjs';

import {IMaskDirective} from 'angular-imask';
import {TranslateService} from '@ngx-translate/core';
import {
    BsDaterangepickerDirective,
    BsLocaleService,
} from 'ngx-bootstrap/datepicker';

import {defineLocale} from 'ngx-bootstrap/chronos';
import * as locales from 'ngx-bootstrap/locale';

import {DateTime} from 'luxon';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IDatepickerCParams;
    @ViewChild(BsDaterangepickerDirective) dp: BsDaterangepickerDirective;
    @ViewChild('imask', {read: IMaskDirective})
    protected imask: IMaskDirective<IMask.AnyMaskedOptions>;

    public override $params: Params.IDatepickerCParams;
    public control: UntypedFormControl;
    public bsValue: Date = new Date();
    protected locale: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IDatepickerCParams,
        configService: ConfigService,
        protected translateService: TranslateService,
        cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected localeService: BsLocaleService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.locale = this.translateService.currentLang;
        const dpLocale: Params.ILocale = this.$params.locales[this.locale] || this.$params.locales['en'];
        defineLocale(dpLocale.name, locales[dpLocale.config]);
        this.localeService.use(dpLocale.name);
        this.control = this.$params.control || new UntypedFormControl('');

        this.control.valueChanges
            .pipe(takeUntil(this.$destroy))
            .subscribe((date: DateTime): void => {
                this.bsValue = date.toJSDate();
            });

        if (this.control.value) {
            this.bsValue = (this.control.value as DateTime).toJSDate();
            this.control.markAsTouched();
        }

        if (this.$params.event?.subscribe) {
            this.eventService.subscribe<DateTime>({name: this.$params.event.subscribe}, (date: DateTime): void => {
                switch (this.$params.event.subscribe) {
                    case 'CHANGE_START_DATE': {
                        const {day, month, year} = date.toObject();
                        this.$params.datepickerOptions.minDate = new Date(year, month - 1, day);
                        break;
                    }
                    case 'CHANGE_END_DATE': {
                        const {day, month, year} = date.toObject();
                        this.$params.datepickerOptions.maxDate = new Date(year, month - 1, day);
                        break;
                    }
                }
            }, this.$destroy);
        }
    }

    public onDateChanged(date: Date): void {
        if (this.imask) {
            this.imask.maskRef.updateValue();
        }

        let dateTime = DateTime.fromJSDate(date);

        if (this.$params.name === 'endDate') {
            dateTime = dateTime.endOf('day');
        }

        if (this.checkRange(date)) {

            this.control.setValue(dateTime);

            if (this.$params.event?.emit) {
                this.eventService.emit({
                    name: this.$params.event.emit,
                    data: dateTime,
                });
            }
        }

        this.control.markAllAsTouched();
        this.cdr.markForCheck();
    }


    public checkRange(dateTime: Date): boolean {
        return dateTime <= this.$params.datepickerOptions.maxDate
            && (!this.$params.datepickerOptions.minDate
            || dateTime >= this.$params.datepickerOptions.minDate);
    }
}
