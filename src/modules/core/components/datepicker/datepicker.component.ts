import {
    Component,
    Inject,
    OnInit,
    Input,
    ViewChild,
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
import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import * as locales from 'ngx-bootstrap/locale';
import {defineLocale} from 'ngx-bootstrap/chronos';

import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    IUnregisteredLanguages,
    unregisteredLanguages,
} from 'wlc-engine/modules/core/components/datepicker/constants';

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
    public bsValue: Date | null = null;
    protected locale: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IDatepickerCParams,
        protected translateService: TranslateService,
        protected eventService: EventService,
        protected localeService: BsLocaleService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.bsValue = this.$params.useEmptyValue ? null : new Date();
        this.locale = this.translateService.currentLang;

        if (this.$params.locales[this.locale]) {
            const dpLocale: Params.ILocale = this.$params.locales[this.locale];
            defineLocale(dpLocale.name, locales[dpLocale.config]);
            this.localeService.use(dpLocale.name);
        } else {
            const exceptionLocale: IUnregisteredLanguages =
                unregisteredLanguages.find(item => item.abbr === this.locale);
            defineLocale(this.locale, exceptionLocale);
            this.localeService.use(exceptionLocale.abbr);
        }

        this.control = this.$params.control || new UntypedFormControl('');

        this.control.valueChanges
            .pipe(takeUntil(this.$destroy))
            .subscribe((date: Dayjs): void => {
                this.bsValue = date.toDate();
            });

        if (this.control.value) {
            this.bsValue = (this.control.value as Dayjs).toDate();
            this.control.markAsTouched();
        }

        if (this.$params.event?.subscribe) {
            this.eventService.subscribe<Dayjs>({name: this.$params.event.subscribe}, (date: Dayjs): void => {
                switch (this.$params.event.subscribe) {
                    case 'CHANGE_START_DATE': {
                        this.$params.datepickerOptions.minDate = new Date(
                            date.year(),
                            date.month(),
                            date.date(),
                        );
                        break;
                    }
                    case 'CHANGE_END_DATE': {
                        this.$params.datepickerOptions.maxDate = new Date(
                            date.year(),
                            date.month(),
                            date.date(),
                        );
                        break;
                    }
                }
            }, this.$destroy);
        }
    }

    public setPrevValue(): void {
        if (dayjs(this.bsValue).isValid()) {
            return;
        }

        this.bsValue = (this.control.value as Dayjs).toDate();
        this.control.updateValueAndValidity();
    }

    public onDateChanged(date: Date): void {
        if (this.imask) {
            this.imask.maskRef.updateValue();
        }

        let dateTime: Dayjs = dayjs(date);

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
        this.$params.datepickerOptions.minDate?.setHours(0,0,0,0);
        this.$params.datepickerOptions.maxDate?.setHours(23,59,59,999);

        return dateTime <= this.$params.datepickerOptions.maxDate
            && (!this.$params.datepickerOptions.minDate
            || dateTime >= this.$params.datepickerOptions.minDate);
    }
}
