import {
    Component,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    ChangeDetectionStrategy,
} from '@angular/core';
import dayjs from 'dayjs';
import {
    distinctUntilKeyChanged,
    map,
    merge,
    takeUntil,
} from 'rxjs';
import _toNumber from 'lodash-es/toNumber';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {SelectValuesService} from 'wlc-engine/modules/core';

import * as Params from './birthday-field.params';
import * as Interfaces from './birthday-field.interfaces';

@Component({
    selector: '[wlc-birth-field]',
    templateUrl: './birthday-field.component.html',
    styleUrls: ['./styles/birthday-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirthdayFieldComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Interfaces.IBirthFieldCParams;
    public override $params: Interfaces.IBirthFieldCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Interfaces.IBirthFieldCParams,
        protected selectValues: SelectValuesService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
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
        let day: number;

        merge(
            this.$params.birthYear.control.valueChanges.pipe(
                map((value: string): Interfaces.IFieldsValue => ({field: 'birthYear', value})),
            ),
            this.$params.birthMonth.control.valueChanges.pipe(
                map((value: string): Interfaces.IFieldsValue => ({field: 'birthMonth', value})),
            ),
        )
            .pipe(
                distinctUntilKeyChanged('value'),
                takeUntil(this.$destroy),
            )
            .subscribe(({field, value}: Interfaces.IFieldsValue) => {
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
                day = dayControl.value;
                this.selectValues.setDaysInMonth(dayjs(`${year}-${month}-01 12:00:00`).daysInMonth());
                if (day && _toNumber(day) > this.selectValues.daysInMonth) {
                    dayControl.setValue('');
                }

                this.cdr.markForCheck();
            });
    }
}
