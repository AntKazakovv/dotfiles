import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
    SimpleChanges,
    OnChanges,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ConfigService,
    EventService,
    SelectValuesService,
    IIndexing,
} from 'wlc-engine/modules/core';

import * as Params from './select.params';

import {
    find as _find,
    union as _union,
    kebabCase as _kebabCase,
} from 'lodash-es';

/**
 * Component select
 *
 * @example
 *
 * {
 *     name: 'core.wlc-select',
 *     params: {
 *
 *     }
 * }
 *
 */
@Component({
    selector: '[wlc-select]',
    templateUrl: './select.component.html',
    styleUrls: ['./styles/select.component.scss'],
})
export class SelectComponent extends AbstractComponent implements OnInit,
    OnChanges {
    @Input() protected inlineParams: Params.ISelectCParams;
    public $params: Params.ISelectCParams;
    public control: FormControl;
    public isOpened: boolean;
    public fieldWlcElement: string;

    public get selectedItem() {
        const selected = _find(this.$params.items, (item) => {
            return item.value == this.control.value;
        });
        return selected?.title;
    };

    protected constantValues: IIndexing<BehaviorSubject<Params.ISelectOptions[]>> = {};
    protected dayList = this.selectValues.getDateList('days');

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISelectCParams,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
        protected EventService: EventService,
        protected selectValues: SelectValuesService,
    )
    {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.prepareModifiers();

        this.control = this.$params?.control;
        this.prepareConstantValues();
        this.fieldWlcElement = 'select_' + _kebabCase(this.$params.name);

        if (this.$params?.options) {
            this.setOptions();
        }

        if (!this.$params.common?.placeholder) {
            this.control.setValue(this.$params.items[0]?.value || '');
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.$params) {
            super.ngOnChanges(changes);
            this.cdr.detectChanges();
        }
    }

    public toggleDropdown(): void {
        if (this.control.status === 'DISABLED') {
            return;
        }
        this.isOpened = !this.isOpened;
        this.cdr.markForCheck();
    }

    public closeDropdown(): void {
        this.isOpened = false;
    }

    public selectOption(item: Params.ISelectOptions): void {
        this.control.setValue(item.value);
        this.toggleDropdown();
        this.cdr.markForCheck();

        this.EventService.emit({
            name: `SELECT_CHOSEN_${this.$params?.name?.toUpperCase()}`,
            data: item,
        });
    }

    public isFieldRequired(): boolean {
        return this.$params.validators?.includes('required');
    }

    private prepareConstantValues(): void {
        this.constantValues = {
            currencies: this.selectValues.prepareCurrency(),
            countries: this.configService.get('countries'),
            phoneCodes: this.selectValues.getPhoneCodes(),
            genders: new BehaviorSubject([
                {
                    value: '',
                    title: gettext('Not selected'),
                },
                {
                    value: 'f',
                    title: gettext('Female'),
                },
                {
                    value: 'm',
                    title: gettext('Male'),
                },
            ]),
            birthMonth: this.selectValues.getDateList('months'),
            birthDay: this.selectValues.dayList,
            birthYear: this.selectValues.getDateList('years'),
            pep: this.selectValues.getPepList(),
            merchants: this.selectValues.getMerchantsList(),
        };
    }

    private setOptions(): void {
        this.constantValues[this.$params.options]
            .pipe(takeUntil(this.$destroy))
            .subscribe((value) => {
                this.$params.items = value || [{
                    title: gettext('No data'),
                    value: '',
                }];
            });
    }

    private prepareModifiers(): void {
        if (!this.$params.common?.customModifiers) {
            return;
        }

        let modifiers: Params.Modifiers[] = [];

        modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        this.addModifiers(modifiers);
    }
}
