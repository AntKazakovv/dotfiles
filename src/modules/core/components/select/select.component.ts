import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
    AfterViewInit,
    SimpleChanges,
    OnChanges,
    HostListener,
    ElementRef,
    ViewChild,
} from '@angular/core';
import {
    animate,
    style,
    transition,
    trigger,
} from '@angular/animations';
import {FormControl} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {
    BehaviorSubject,
    fromEvent,
} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
    AbstractComponent,
    ConfigService,
    EventService,
    SelectValuesService,
    IIndexing,
    ITooltipCParams,
    GlobalHelper,
    ISelectOptions,
} from 'wlc-engine/modules/core';

import * as Params from './select.params';

import _union from 'lodash-es/union';
import _kebabCase from 'lodash-es/kebabCase';
import _findIndex from 'lodash-es/findIndex';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';
import _sortBy from 'lodash-es/sortBy';
import _cloneDeep from 'lodash-es/cloneDeep';
import _map from 'lodash-es/map';

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
    animations: [
        trigger('openClose', [
            transition(':enter', [
                style({opacity: 0, height: 0}),
                animate('150ms', style({opacity: 1, height: '*'})),
            ]),
            transition(':leave', [
                style({height: '*', opacity: 1}),
                animate('100ms', style({opacity: 0, height: 0})),
            ]),
        ]),
    ],
})
export class SelectComponent extends AbstractComponent implements OnInit, OnChanges, AfterViewInit {

    @ViewChild('selectList') protected selectList: ElementRef<HTMLElement>;
    @ViewChild('searchInput') protected searchInput: ElementRef<HTMLElement>;

    @Input() protected inlineParams: Params.ISelectCParams;

    public $params: Params.ISelectCParams;
    public control: FormControl;
    public isOpened: boolean;
    public fieldWlcElement: string;
    public activeItemIndex: number;
    public searchText: string;
    public foundItems: Params.ISelectOptions[];

    protected constantValues: IIndexing<BehaviorSubject<Params.ISelectOptions[]>> = {};
    protected dayList = this.selectValues.getDateList('days');

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISelectCParams,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
        protected EventService: EventService,
        protected selectValues: SelectValuesService,
        protected translate: TranslateService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.prepareModifiers();
        this.prepareConstantValues();

        this.foundItems = _cloneDeep(this.$params.items);
        this.control = this.$params.control;
        this.fieldWlcElement = 'select_' + _kebabCase(this.$params.name);

        if (this.$params.options) {
            this.setOptions();
        }

        if (!this.control.value && !this.$params.common?.placeholder) {
            this.control.setValue(this.foundItems[0]?.value || '');
        }

        if (this.$params.value && _find(this.foundItems, item => item.value === this.$params.value)) {
            this.control.setValue(this.$params.value);
        }

        if (this.control.value  && !_find(this.foundItems, item => item.value === this.control.value)) {
            this.control.setValue(this.foundItems[0]?.value || '');
        }

        if (this.$params.autoSelect) {
            const country = this.configService.get<string>('appConfig.country');

            switch (this.$params.name) {
                case 'currency': {
                    const currency = this.configService.get<string>(
                        `$base.registration.selectCurrencyByCountry.${country}`,
                    );

                    if (currency && _find(this.foundItems, item => item.value === currency)) {
                        this.control.setValue(currency);
                    }

                    break;
                }
                case 'countryCode': {
                    this.control.setValue(country);
                    break;
                }
            }
        }
        this.getSelectedItemIndex();
        this.translateItems();
    }

    public ngAfterViewInit(): void {
        if (this.$params.useSearch && this.searchInput?.nativeElement) {
            fromEvent(this.searchInput.nativeElement, 'focus')
                .pipe(takeUntil(this.$destroy))
                .subscribe(() => {
                    if (this.searchInput.nativeElement.hasAttribute('readonly')) {
                        this.searchInput.nativeElement.removeAttribute('readonly');
                        this.searchInput.nativeElement.blur();
                        this.searchInput.nativeElement.focus();
                    }
                    this.openDropdown();
                    this.cdr.detectChanges();
                });

            setTimeout(() => {
                if (!this.control.disabled) {
                    this.searchText = this.translate.instant(this.placeholderText);
                }
            });
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.$params) {
            super.ngOnChanges(changes);
            this.cdr.detectChanges();
        }
    }

    /**
     * The method get text on selector button and input
     *
     * @method placeholderText
     * @returns {string} string
     */
    public get placeholderText(): string {
        const res = _find(this.$params.items, item => item.value === this.control.value);
        if (res) {
            return res.title.toString();
        } else {
            return this.$params.common?.placeholder.toString() || '';
        }
    }

    /**
     * The method translate Items titles and placeholders
     *
     * @method  translateItems
     * @returns {void} void
     */
    protected translateItems() {
        this.$params.items = _map(this.$params.items, (item) => {
            item.title = this.translate.instant(item.title.toString());
            return item;
        });
    }

    /**
     * The method get wlc-tooltip inline parameters
     *
     * @method tooltipParams
     * @returns {ITooltipCParams} ITooltipCParams
     */
    public get tooltipParams(): ITooltipCParams {
        return {
            inlineText: this.$params.common?.tooltipText,
            themeMod: this.$params.common?.tooltipMod,
            iconName: this.$params.common?.tooltipIcon,
            modal: this.$params.common?.tooltipModal,
            modalParams: this.$params.common?.tooltipModalParams,
        };
    }

    /**
     * get index of active option in select list
     */
    public getSelectedItemIndex(): void {
        this.activeItemIndex = _findIndex(this.foundItems, (item) => item.value === this.control.value);
    };

    /**
     * The method scroll select list on chosen option
     *
     * @method scrollSelectList
     * @returns {void} void
     */
    public scrollSelectList(): void {
        if (this.activeItemIndex < 0) {
            return;
        }
        this.selectList?.nativeElement?.children[this.activeItemIndex]?.scrollIntoView({block: 'nearest'});
    }

    /**
     * The method toggle open close select list and clear search field
     *
     * @method toggleDropdown
     * @returns {void} void
     */
    public toggleDropdown(): void {
        if (this.control.disabled) {
            return;
        }

        if (this.isOpened) {
            this.closeDropdown();
        } else {
            this.openDropdown();
            if (this.$params.useSearch && this.searchInput?.nativeElement) {
                this.searchInput.nativeElement.focus();
            }
        }

        this.cdr.markForCheck();
    }

    /**
     * The method close select list and clear search field
     *
     * @method closeDropdown
     * @returns {void} void
     */
    public closeDropdown(): void {
        if (!this.isOpened || this.control.disabled) {
            return;
        }
        this.control.markAsTouched();
        this.control.updateValueAndValidity();
        this.isOpened = false;
        this.clearSearchField();
        this.searchText = this.translate.instant(this.placeholderText);
        this.getSelectedItemIndex();
    }

    /**
     * The method open select list and clear search field
     *
     * @method openDropdown
     * @returns {void} void
     */
    public openDropdown(): void {
        if (this.isOpened || this.control.disabled) {
            return;
        }

        this.isOpened = true;
        this.clearSearchField();
    }

    /**
     * The method chose option in select list and close list
     *
     * @method choseSelectByClick
     * @param {ISelectOptions} item - select item
     * @param {number} index - index select item
     * @returns {void} void
     */
    public choseSelectByClick(item: Params.ISelectOptions, index: number): void {
        this.activeItemIndex = index;
        this.selectOption(item);
        this.toggleDropdown();
        this.cdr.markForCheck();
    }

    /**
     * The method check required rule in validators
     *
     * @method isFieldRequired
     * @returns {boolean} boolean
     */
    public isFieldRequired(): boolean {
        return this.$params.validators?.includes('required');
    }

    /**
     * The method search include substr in items && sort array by index
     *
     * @method searchItems
     * @returns {void} void
     */
    public searchItems(): void {
        const searchText = GlobalHelper.shieldingString(this.searchText);
        const regExp = new RegExp(`(${searchText})`, this.$params.insensitiveSearch ? 'i' : '');
        this.foundItems = _cloneDeep(_filter(this.$params.items, option => !!option.title.toString().match(regExp)));

        if (this.searchText) {
            const sortFn = (obj: ISelectOptions) => obj.title.toString().match(regExp)?.index;
            this.foundItems = _sortBy(this.foundItems, sortFn);
            this.getSelectedItemIndex();
        }
    }

    /**
     * listen event keydown and navigate on select list by this event
     *
     * @method onKeyDown
     * @param {KeyboardEvent} event
     * @returns {void} void
     */
    @HostListener('keydown', ['$event'])
    protected onKeyDown(event: KeyboardEvent): void {

        switch (event.code) {
            case 'Tab':
                this.closeDropdown();
                break;
            case 'Escape':
                this.closeDropdown();
                event.preventDefault();
                break;
            case 'ArrowUp':
                if (this.activeItemIndex < 1) {
                    break;
                }
                this.selectOption(this.foundItems[--this.activeItemIndex]);
                this.scrollSelectList();
                event.preventDefault();
                break;
            case 'ArrowDown':
                if (this.activeItemIndex === this.foundItems.length - 1) {
                    break;
                }
                this.selectOption(this.foundItems[++this.activeItemIndex]);
                this.scrollSelectList();
                event.preventDefault();
                break;
            case 'Enter':
                this.toggleDropdown();
                event.preventDefault();
                break;
            case 'Space':
                if (!this.isOpened) {
                    this.toggleDropdown();
                }
                event.preventDefault();
                break;
            default:
                if (this.$params.useSearch && !this.isOpened) {
                    event.preventDefault();
                }
                break;
        }
    }

    /**
     * The method select option in select list
     *
     * @method selectOption
     * @param {ISelectOptions} item
     * @returns {void} void
     */
    protected selectOption(item: Params.ISelectOptions): void {
        this.control.setValue(item.value);

        this.EventService.emit({
            name: `SELECT_CHOSEN_${this.$params?.name?.toUpperCase()}`,
            data: item,
        });

        if (!this.isOpened) {
            this.searchText = this.translate.instant(this.placeholderText);
        }
    }

    /**
     * The method clear text in search field
     *
     * @method clearSearchField
     * @returns {void} void
     */
    protected clearSearchField(): void {
        this.searchText = '';
        this.searchItems();
    }

    /**
     * The method get constant values from configService and selectValues by select fields names
     *
     * @method prepareConstantValues
     * @returns {void} void
     */
    protected prepareConstantValues(): void {
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

    /**
     * The method set constant values
     *
     * @method setOptions
     * @returns {void} void
     */
    protected setOptions(): void {
        this.constantValues[this.$params.options]
            .pipe(takeUntil(this.$destroy))
            .subscribe((value) => {
                this.$params.items = value || [{
                    title: gettext('No data'),
                    value: '',
                }];
                this.foundItems = _cloneDeep(this.$params.items);
            });
    }

    /**
     * The method prepare modifiers
     *
     * @method prepareModifiers
     * @returns {void} void
     */
    protected prepareModifiers(): void {
        if (!this.$params.common?.customModifiers) {
            return;
        }

        let modifiers: Params.Modifiers[] = [];

        modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        this.addModifiers(modifiers);
    }
}
