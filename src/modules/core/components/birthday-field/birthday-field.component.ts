import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {DateTime} from 'luxon';
import {
    distinctUntilKeyChanged,
    map,
    merge,
    takeUntil,
} from 'rxjs';
import _toNumber from 'lodash-es/toNumber';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ConfigService,
    SelectValuesService,
} from 'wlc-engine/modules/core';

import * as Params from './birthday-field.params';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-birth-field]',
    templateUrl: './birthday-field.component.html',
    styleUrls: ['./styles/birthday-field.component.scss'],
})
export class BirthdayFieldComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Params.IBirthFieldCParams;
    public override $params: Params.IBirthFieldCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBirthFieldCParams,
        configService: ConfigService,
        protected selectValues: SelectValuesService,
        cdr: ChangeDetectorRef,
    )
    {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.provideParams();
        this.subscribeControlsChanges();
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        this.selectValues.setDaysInMonth(31);
    }

    protected provideParams(): void {
        this.$params.birthDay['theme'] = this.$params.birthDay['theme'] || this.$params.theme;
        this.$params.birthMonth['theme'] = this.$params.birthMonth['theme'] || this.$params.theme;
        this.$params.birthYear['theme'] = this.$params.birthYear['theme'] || this.$params.theme;
    }

    protected subscribeControlsChanges(): void {
        const {control: dayControl} = this.$params.birthDay;
        let month: number;
        let year: number;

        merge(
            this.$params.birthYear.control.valueChanges.pipe(
                map((value: string): Params.IFieldsValue => ({field: 'birthYear', value})),
            ),
            this.$params.birthMonth.control.valueChanges.pipe(
                map((value: string): Params.IFieldsValue => ({field: 'birthMonth', value})),
            ),
        )
            .pipe(
                distinctUntilKeyChanged('value'),
                takeUntil(this.$destroy),
            )
            .subscribe(({field, value}: Params.IFieldsValue) => {
                const inputValue: number = _toNumber(value);

                if (field === 'birthMonth') {
                    year = _toNumber(this.$params.birthYear.control.value);
                    month = inputValue;
                }

                if (field === 'birthYear') {
                    year = inputValue;
                    month = _toNumber(this.$params.birthMonth.control.value);
                }

                /** по дефолту оставляю високосный год и месяц январь, чтобы можно было выбрать сразу 29 февраля
                 * при не выбранном заранее годе, а также 31 число при невыбранном заранее месяце
                 */
                year = year || 2000;
                month = month || 1;
                this.selectValues.setDaysInMonth(DateTime.local(year, month).daysInMonth);

                if (dayControl.value && _toNumber(dayControl.value) > this.selectValues.daysInMonth) {
                    dayControl.setValue('');
                }

                this.cdr.detectChanges();
            });
    }
}
