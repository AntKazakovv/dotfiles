import {
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
    ChangeDetectionStrategy,
} from '@angular/core';
import {
    animate,
    style,
    transition,
    trigger,
} from '@angular/animations';
import {UntypedFormControl} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {
    BehaviorSubject,
    Subject,
    fromEvent,
} from 'rxjs';
import {
    takeUntil,
    first,
    debounceTime,
    filter,
} from 'rxjs/operators';

import _some from 'lodash-es/some';
import _union from 'lodash-es/union';
import _kebabCase from 'lodash-es/kebabCase';
import _findIndex from 'lodash-es/findIndex';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';
import _sortBy from 'lodash-es/sortBy';
import _cloneDeep from 'lodash-es/cloneDeep';
import _map from 'lodash-es/map';
import _has from 'lodash-es/has';
import _memoize from 'lodash-es/memoize';

import {ICountry} from 'wlc-engine/modules/core/system/interfaces/fundist.interface';
import {
    AbstractComponent,
    EventService,
    SelectValuesService,
    IIndexing,
    ITooltipCParams,
    GlobalHelper,
    ISelectOptions,
} from 'wlc-engine/modules/core';
import {CustomHook} from 'wlc-engine/modules/core/system/decorators/hook.decorator';

import {suggestOption} from 'wlc-engine/modules/core/components/select/helpers/suggest-option.helper';
import {mergeAliases} from 'wlc-engine/modules/core/components/select/helpers/merge-aliases.helper';

import * as Params from './select.params';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent extends AbstractComponent implements OnInit, OnChanges, AfterViewInit {

    @ViewChild('selectList') protected selectList: ElementRef<HTMLElement>;
    @ViewChild('searchInput') protected searchInput: ElementRef<HTMLElement>;

    @Input() protected inlineParams: Params.ISelectCParams;

    public override $params: Params.ISelectCParams;
    public control: UntypedFormControl;
    public isOpened: boolean;
    public fieldWlcElement: string;
    public activeItemIndex: number;
    public searchText: string;
    public foundItems: Params.ISelectOptions[];

    protected constantValues: IIndexing<BehaviorSubject<Params.ISelectOptions[]>> = {};
    protected clearedValue: unknown;
    protected memoizePlaceholderText = _memoize(this.placeholderText);

    protected searchSubject$ = new Subject<string>();
    protected aliases: Params.IAlias[] = [];

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISelectCParams,
        protected eventService: EventService,
        protected selectValues: SelectValuesService,
        protected translateService: TranslateService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.prepareModifiers();

        this.foundItems = _cloneDeep(this.$params.items);
        this.control = this.$params.control;
        this.constantValues = this.selectValues.prepareConstantValues(
            this.$params.options,
            this.control,
            this.$destroy);

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

        if (this.control.value && !_find(this.foundItems, item => item.value === this.control.value)) {
            this.control.setValue(this.foundItems[0]?.value || '');
        }

        if (this.foundItems.length && _has(this.foundItems[0], 'icon')) {
            this.prepareIcons();
        }

        if (this.foundItems.length && _has(this.foundItems[0], 'note')) {
            this.addModifiers('with-note');
        }

        if (this.$params.name === 'countryCode' && !this.control.value
            && this.configService.get<boolean>('$base.registration.filterCurrencyByCountry')) {
            this.$params.autoSelect = true;
        }

        if (this.$params.autoSelect) {
            const country = this.configService.get<string>('appConfig.country');

            switch (this.$params.name) {
                case 'countryCode': {
                    this.control.setValue(country);
                    if (this.configService.get<boolean>('$base.registration.filterCurrencyByCountry')) {
                        this.eventService.emit({
                            name: 'SELECT_CHOSEN_COUNTRYCODE',
                            data: {
                                value: country,
                            },
                        });
                    }
                    break;
                }
                case 'phoneCode': {
                    if (this.control.value) {
                        break;
                    }
                    this.configService.get<BehaviorSubject<ICountry[]>>('countries')
                        .pipe(first((v) => !!v.length))
                        .subscribe(data => {
                            const country = this.configService.get<string>('appConfig.country');
                            const countryCode = _find(data, (item) => country === item?.value);
                            this.control.setValue(`+${+(countryCode.phoneCode)}`);
                        });
                    break;
                }
            }
        }

        if (this.$params.name === 'countryCode') {
            this.control.valueChanges
                .pipe(
                    filter((val: string): boolean => !val),
                    takeUntil(this.$destroy),
                )
                .subscribe((): void => {
                    if (this.isOpened) {
                        return;
                    }
                    this.searchText = this.translateService.instant(this.memoizePlaceholderText(
                        this.control.value, this.$params.items, this.$params.common?.placeholder,
                    ));
                });
        }

        if (this.$params.updateOnControlChange) {
            this.control.valueChanges.pipe(takeUntil(this.$destroy))
                .subscribe((val: string): void => {
                    this.activeItemIndex = _findIndex(this.foundItems, {value: val});
                    this.selectOption(this.foundItems[this.activeItemIndex], false);
                    this.cdr.markForCheck();
                });
        }

        if (this.$params.name === 'currency' &&
        this.configService.get('$base.registration.filterCurrencyByCountry')) {
            this.filterCurrencyByCountry();
        }

        if (this.$params.name === 'countryCode') {
            this.changeLegalAgeByCountry();
        }

        this.getSelectedItemIndex();
        this.translateItems();

        this.control.statusChanges
            .pipe(takeUntil(this.$destroy))
            .subscribe(() => this.cdr.markForCheck());

        this.handleSmartSearch();
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
                });

            setTimeout(() => {
                if (!this.control.disabled) {
                    this.searchText = this.translateService.instant(this.memoizePlaceholderText(
                        this.control.value, this.$params.items, this.$params.common?.placeholder,
                    ));
                }
            });
        }
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        if (this.$params) {
            super.ngOnChanges(changes);
        }
    }

    /**
     * The method get text on selector button and input
     *
     * @method placeholderText
     * @returns {string} string
     */
    public placeholderText(
        value: string,
        items: ISelectOptions<unknown>[],
        placeholder?: Params.ISelectCParams['common']['placeholder'],
    ): string {
        const res = _find(items, item => item.value === value);

        if (res) {
            return res.title.toString();
        } else {
            return placeholder?.toString() || '';
        }
    }

    /**
     * The method translate Items titles and placeholders
     *
     * @method  translateItems
     * @returns {void} void
     */
    protected translateItems(): void {
        this.$params.items = _map(this.$params.items, (item) => {
            item.title = this.translateService.instant(item.title.toString());
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

        let currentItem: ISelectOptions<unknown> | undefined = this.foundItems[this.activeItemIndex];

        if (!currentItem && this.foundItems.length > 0) {
            currentItem = this.foundItems[0];
        }

        this.selectOption(currentItem);
        this.control.markAsTouched();
        this.control.updateValueAndValidity();
        this.isOpened = false;
        this.clearSearchField();
        this.searchText = this.translateService.instant(this.memoizePlaceholderText(
            this.control.value, this.$params.items, this.$params.common?.placeholder,
        ));
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
     * The method resolve what method or methods are executing to search items (countries...)
     * List of possible execute methods: searchItems(), modifiedSearchItems(), searchInAliases(), smartSearch()
     * @method executeSearch
     * @returns {void} void
     */
    public executeSearch(): void {
        const useDeepSearch: boolean = this.$params?.deepSearch?.use;

        if (!useDeepSearch){
            this.searchItems();
            return;
        }

        this.prepareAliases();
        this.modifiedSearchItems();
        this.searchInAliases();
        this.smartSearch();
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
            const sortFn = (obj: ISelectOptions): number => obj.title.toString().match(regExp)?.index;
            this.foundItems = _sortBy(this.foundItems, sortFn);
            this.getSelectedItemIndex();
        }
    }

    /**
     * The method search work like original, but try to find items that match from beginning of the string.
     * Sometimes original method works wrong with smart search and try to match in middle of the variant.
     *
     * @method modifiedSearchItems
     * @returns {void} void
     */
    public modifiedSearchItems(): void {
        const searchText: string = GlobalHelper.shieldingString(this.searchText);
        const regExp: RegExp = new RegExp(`^(${searchText})`, this.$params.insensitiveSearch ? 'i' : '');
        this.foundItems = _cloneDeep(_filter(this.$params.items, option => !!option.title.toString().match(regExp)));

        if (this.searchText) {
            const sortFn = (obj: ISelectOptions): number => obj.title.toString().match(regExp)?.index;
            this.foundItems = _sortBy(this.foundItems, sortFn);
            this.getSelectedItemIndex();
        }
    }

    /**
     * The method try to search items in aliases if user made mistake.
     *
     * @method searchInAliases
     * @returns {void} void
     */
    public searchInAliases(): void {
        if (this.foundItems.length && this.aliases.length) {
            return;
        }

        const searchText: string = GlobalHelper.shieldingString(this.searchText);
        const regExp: RegExp = new RegExp(`(${searchText})`, this.$params.insensitiveSearch ? 'i' : '');

        const aliasFilterFn = (item: Params.IAlias): boolean => _some(item.aliases, alias => alias.match(regExp));
        const matchedAliases: Params.IAlias[] = this.aliases.filter(aliasFilterFn);
        const matchedTitles: string[] = _map(matchedAliases, (item) => item.value);

        const filterFn = (item: ISelectOptions): boolean => matchedTitles.includes(item.value.toString());
        this.foundItems = _filter(this.$params.items, filterFn);
        this.getSelectedItemIndex();
    }

    /**
     * Prepare country aliases.
     *
     * @method prepareCountryAliases
     * @returns {IAlias[]} merged aliases from params with all countries that contains iso2 and iso3
     */
    protected prepareAliases(): void {
        const aliases: Record<string, Params.IAlias[]> = this.configService.get('$base.forms.aliases') || {};
        const options: ISelectOptions<unknown>[] = this.$params.items;
        const aliasesType: Params.TAliasesType  = this.$params.deepSearch.aliasesType;
        this.aliases = mergeAliases(aliases, options, aliasesType);
    }

    /**
     * The method subscribe on searchSubject$ and allow to handle search by using Levenshtein suggestions.
     *
     * @method handleSmartSearch
     * @returns {void} void
     */
    public handleSmartSearch():void {
        const debounceTimeMs: number = 500;

        this.searchSubject$
            .pipe(debounceTime(debounceTimeMs), takeUntil(this.$destroy))
            .subscribe((inputValue) => {
                this.foundItems = suggestOption(inputValue, this.$params.items, this.$params.deepSearch?.searchLimit);
                this.cdr.markForCheck();
            });
    }

    /**
     * The method send search text to searchSubject$
     * that allow search items by using Levenshtein distance if user made mistake.
     *
     * @method smartSearch
     * @returns {void} void
     */
    public smartSearch(): void {
        if (this.foundItems.length) {
            return;
        }

        const searchText: string = GlobalHelper.shieldingString(this.searchText);
        this.searchSubject$.next(searchText);
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
                this.choiceOption(this.foundItems[--this.activeItemIndex]);
                this.scrollSelectList();
                event.preventDefault();
                break;
            case 'ArrowDown':
                if (this.activeItemIndex === this.foundItems.length - 1) {
                    break;
                }
                this.choiceOption(this.foundItems[++this.activeItemIndex]);
                this.scrollSelectList();
                event.preventDefault();
                break;
            case 'Enter':
                this.selectOption(this.foundItems[this.activeItemIndex]);
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

    protected choiceOption(item: Params.ISelectOptions): void {
        this.searchText = item.title as string;
    }

    /**
     * The method select option in select list
     *
     * @method selectOption
     * @param {ISelectOptions} item
     * @param {boolean} pushToControl
     * @returns {void} void
     */
    @CustomHook('core', 'selectSelectOption')
    protected selectOption(item: Params.ISelectOptions | undefined, pushToControl: boolean = true): void {
        if (pushToControl) {
            this.control.setValue(item?.value);
        }

        if (item) {
            this.eventService.emit({
                name: `SELECT_CHOSEN_${this.$params?.name?.toUpperCase()}`,
                data: item,
            });
        }

        if (!this.isOpened) {
            this.searchText = this.translateService.instant(this.memoizePlaceholderText(
                this.control.value, this.$params.items, this.$params.common?.placeholder,
            ));
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
     * The method set constant values
     *
     * @method setOptions
     * @returns {void} void
     */
    protected setOptions(): void {
        this.constantValues?.[this.$params.options]
            .pipe(takeUntil(this.$destroy))
            .subscribe((value) => {
                this.$params.items = value ? _cloneDeep(value) : [{
                    title: gettext('No data'),
                    value: '',
                }];
                this.foundItems = _cloneDeep(this.$params.items);

                if (this.$params.name === 'currency' && this.foundItems.length) {

                    if (_has(this.foundItems[0], 'icon')) {
                        this.prepareIcons();
                    }

                    if (!this.control.value) {
                        if (this.$params.autoSelect) {
                            this.setDefaultCurrency();
                            this.getSelectedItemIndex();
                        } else if (!this.$params.common?.placeholder) {
                            this.activeItemIndex = 0;
                            this.control.setValue(this.foundItems[0].value);
                        }
                    }
                }

                if (this.control.value && !_find(this.foundItems, item => item.value === this.control.value)) {
                    this.clearedValue = this.control.value;
                    this.control.setValue(this.foundItems[0]?.value || '');
                }

                if (!this.control.value
                    && this.clearedValue
                    && _find(this.foundItems, item => item.value === this.clearedValue)
                ) {
                    this.control.setValue(this.clearedValue);
                    this.clearedValue = null;
                }
            });
    }

    /**
     * This method subscribe on change country select
     *
     * @method filterCurrencyByCountry
     * @returns {void} void
     */
    public filterCurrencyByCountry(): void {
        this.eventService.subscribe({
            name: 'SELECT_CHOSEN_COUNTRYCODE',
        }, (data: Params.ISelectOptions) => {
            this.updateCurrencyOption(data.value.toString());
        });
    }

    /**
     * This method update currency select, if country is selected
     *
     * @method updateCurrencyOption
     * @returns {void} void
     */
    public updateCurrencyOption(selectCountry: string): void {
        if (this.configService.get('$base.registration.regCurrenciesByCountries')) {
            this.$params.items = this.selectValues.filterCurrency(selectCountry).value;
        }

        if (this.configService.get('$base.registration.selectCurrencyByCountry')) {
            this.setDefaultCurrency(selectCountry, this.$params.items);
        }
    }

    /**
     * This method for set default option for currency
     *
     * @method setDefaultCurrency
     * @returns {void} void
     */
    public setDefaultCurrency(
        country: string = this.configService.get<string>('appConfig.country'),
        items: Params.ISelectOptions[] = this.foundItems,
    ): void {
        const currency = this.configService.get<string>(
            `$base.registration.selectCurrencyByCountry.${country}`,
        );

        if (currency && _find(items, item => item.value === currency)) {
            this.control.setValue(currency);
        } else {
            this.control.setValue(items[0].value);
        }
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

    /**
     * This method subscribe on change country select
     *
     * @method changeLegalAgeByCountry
     * @returns {void} void
     */
    protected changeLegalAgeByCountry(): void {
        this.eventService.subscribe({
            name: 'SELECT_CHOSEN_COUNTRYCODE',
        }, (data: Params.ISelectOptions) => {
            this.updateLegalAgeByCountry(data?.value.toString());
        }, this.$destroy);
    }

    /**
     * This method update the legal age for Estonia
     *
     * @method updateLegalAgeByCountry
     * @returns {void} void
     */
    protected updateLegalAgeByCountry(selectCountry: string): void {
        const legalAge = this.getAgeFromConfig(selectCountry);
        if (legalAge !== this.configService.get('legalAgeByCountry')) {
            this.configService.set<number>({name: 'legalAgeByCountry', value: legalAge});
            this.eventService.emit({name: 'UPDATE_LEGAL_AGE'});
        }
    }

    protected getAgeFromConfig(selectCountry: string): number {
        return this.configService.get<number>(`appConfig.countryAgeBan.${selectCountry}`)
            || this.configService.get('$base.profile.legalAge');
    }

    protected prepareIcons(): void {
        this.$params.useIcon = true;
        this.addModifiers('with-icon');
    }
}
