import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DateTime, Info} from 'luxon';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core/system/services';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {ICurrency} from 'wlc-engine/modules/finances/system/interfaces';

import * as Params from './select.params';

import {
    map as _map,
    filter as _filter,
    find as _find,
    union as _union,
    kebabCase as _kebabCase,
    range as _range,
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
export class SelectComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ISelectCParams;
    public $params: Params.ISelectCParams;
    public control: FormControl;
    public isOpened: boolean;
    public fieldWlcElement: string;
    protected daysInMonth: number = 31;

    public get selectedItem() {
        const selected = _find(this.$params.items,
            (item) => {
                return item.value === this.control.value;
            },
        );
        return selected?.title;
    };

    private constantValues: IIndexing<BehaviorSubject<Params.ISelectOptions[]>> = {};

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISelectCParams,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
        private EventService: EventService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.prepareModifiers();

        this.control = this.$params?.control;
        this.prepareConstantValues();
        this.fieldWlcElement = 'select_' + _kebabCase(this.$params.name);

        //TODO custom fields
        if (this.$params?.options) {
            this.setOptions();
        }

        if (this.$params.name === 'birthDay') {
            this.EventService.subscribe({
                name: `SELECT_CHOSEN_BIRTHMONTH`,
            }, (value: Params.ISelectOptions) => {
                this.daysInMonth = DateTime.local(DateTime.local().year, value.value as number).daysInMonth;
                this.prepareConstantValues();
                this.setOptions();
                this.cdr.markForCheck();
            });
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

    private prepareConstantValues(): void {
        this.constantValues = {
            currencies: this.prepareCurrency(),
            countries: this.configService.get('countries'),
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
            birthMonth: this.getDateList('months'),
            birthDay: this.getDateList('days'),
            birthYear: this.getDateList('years'),
        };
    }

    private setOptions(): void {
        this.constantValues[this.$params.options]
            .pipe(takeUntil(this.$destroy))
            .subscribe((value) => {
                this.$params.items = value || [];
            });
    }

    // TODO move to abstract class
    private prepareModifiers(): void {
        if (!this.$params.common.customModifiers) {
            return;
        }

        let modifiers: Params.Modifiers[] = [];

        modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        this.addModifiers(modifiers);
    }

    private prepareCurrency(): BehaviorSubject<Params.ISelectOptions[]> {
        const modifyCurrencies = this.configService.get<IIndexing<ICurrency>>('appConfig.siteconfig.currencies');
        return new BehaviorSubject(
            _map(
                _filter(modifyCurrencies, (el: ICurrency) => {
                    return el.registration;
                }), (el) => {
                    return {title: el.Name, value: el.Alias};
                }),
        );
    }

    private getDateList(value: string): BehaviorSubject<Params.ISelectOptions[]> {
        let list: Params.ISelectOptions[] = [];
        switch (value) {
            case 'days': {
                let day = 1;
                while (this.daysInMonth >= day) {
                    list.push({title: day, value: '' + day});
                    day++;
                }
                break;
            }

            case 'months': {
                list = _map(Info.months(), (month: string, index: number) => {
                    return {title: gettext(month), value: '' + ++index};
                });
                break;
            }

            case 'years': {
                list = _map(_range(DateTime.local().year - 18, 1900), (n) => {
                    return {title: '' + n, value: '' + n};
                });
                break;
            }
        }

        return new BehaviorSubject<Params.ISelectOptions[]>(list);
    };
}
