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
                    return el.registration;
                }), (el) => {
                    return {title: el.Name, value: el.Alias};
                }),
        );
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
}
