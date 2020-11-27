import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {ConfigService, EventService} from 'wlc-engine/modules/core/services';
import {IIndexing} from 'wlc-engine/interfaces';
import {ICurrency} from 'wlc-engine/modules/finances/interfaces';
import {BehaviorSubject} from 'rxjs';
import {takeUntil, first} from 'rxjs/operators';

import * as Params from './select.params';

import {
    map as _map,
    filter as _filter,
    find as _find,
} from 'lodash';

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
    @Input() protected inlineParams: Params.ISelectParams;
    public $params: Params.ISelectParams;
    public control: FormControl;
    public isOpened: boolean;
    public get selectedItem() {
        const selected = _find(this.$params.items as Params.ISelectOptions[],
            (item) => {
                return item.value === this.control.value;
            },
        );
        return selected?.title;
    };

    private constantValues: IIndexing<BehaviorSubject<Params.ISelectOptions[]>> = {};

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISelectParams,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
        private EventService: EventService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.control = this.$params?.control;

        this.constantValues = {
            currencies: this.prepareCurrency(),
            countries: this.configService.get('countries'),
            genders: new BehaviorSubject([
                {
                    value: '',
                    title: 'Not selected',
                },
                {
                    value: 'f',
                    title: 'Female',
                },
                {
                    value: 'm',
                    title: 'Male',
                },
            ]),
        };

        //TODO custom fields
        if (this.$params?.options) {
            this.constantValues[this.$params.options].pipe(takeUntil(this.$destroy)).subscribe((value) => {
                this.$params.items = value || [];
            });
        }
    }

    public toggleDropdown(): void {
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

    private prepareCurrency(): BehaviorSubject<Params.ISelectOptions[]> {
        const modifyCurrencies = this.configService.get<IIndexing<ICurrency>>('appConfig.siteconfig.currencies');

        return new BehaviorSubject(
            _map(
                _filter(modifyCurrencies, (el: ICurrency) => {
                    return !el.registration;
                }), (el) => {
                    return {title: el.Name, value: el.Alias};
                }),
        );

    }
}
