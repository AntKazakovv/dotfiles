import {
    Component,
    Inject,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {
    IMyDefaultMonth,
    AngularMyDatePickerDirective,
    IMyDateModel,
} from 'angular-mydatepicker';
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
// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-datepicker]',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./styles/datepicker.component.scss'],
})
export class DatepickerComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IDatepickerCParams;
    @ViewChild('mask') mask: ElementRef;
    @ViewChild(AngularMyDatePickerDirective) dp: AngularMyDatePickerDirective;
    public $params: Params.IDatepickerCParams;
    public control: FormControl;
    public locale: string;
    public defaultMonth: IMyDefaultMonth;
    public dpModel: IMyDateModel;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IDatepickerCParams,
        protected configService: ConfigService,
        protected translateService: TranslateService,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.locale = this.translateService.currentLang;
        this.control = this.$params.control || new FormControl('');
        const disableSince = this.$params.datepickerOptions.disableSince;

        this.control.valueChanges.subscribe((date: DateTime): void => {
            this.dpModel = {
                isRange: false,
                singleDate: {
                    jsDate: date.toJSDate(),
                },
            };
        });

        if (this.control.value) {
            this.dpModel = {
                isRange: false,
                singleDate: {
                    jsDate: (this.control.value as DateTime).toJSDate(),
                },
            };
            this.control.markAsTouched();
        }

        this.defaultMonth = this.$params.defaultMonth || {
            defMonth: !!disableSince
                ? DateTime.fromObject(disableSince).toFormat('LL/yyyy')
                : DateTime.local().toFormat('LL/yyyy'),
            overrideSelection: false,
        };

        if (this.$params.event?.subscribe) {
            this.eventService.subscribe<DateTime>({name: this.$params.event.subscribe}, (date: DateTime): void => {
                switch (this.$params.event.subscribe) {
                    case 'CHANGE_START_DATE': {
                        const {day, month, year} = date.minus({day: 1}).toObject();
                        this.dp.parseOptions({
                            disableUntil: {day, month, year},
                        });
                        break;
                    }
                    case 'CHANGE_END_DATE': {
                        const {day, month, year} = date.plus({day: 1}).toObject();
                        this.dp.parseOptions({
                            disableSince: {day, month, year},
                        });
                        break;
                    }
                }
            }, this.$destroy);
        }
    }

    public onDateChanged(date: IMyDateModel): void {
        this.mask.nativeElement.mask.updateValue();
        let dateTime = DateTime.fromJSDate(date.singleDate?.jsDate);

        if (this.$params.name === 'endDate') {
            dateTime = dateTime.endOf('day');
        }

        this.control.setValue(dateTime);

        if (this.$params.event?.emit) {
            this.eventService.emit({
                name: this.$params.event.emit,
                data: dateTime,
            });
        }

        this.control.markAllAsTouched();
        this.cdr.markForCheck();
    }
}
