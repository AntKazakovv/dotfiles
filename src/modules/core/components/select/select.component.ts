import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
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
import {BehaviorSubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
    AbstractComponent,
    ConfigService,
    EventService,
    SelectValuesService,
    IIndexing,
    ITooltipCParams,
} from 'wlc-engine/modules/core';

import * as Params from './select.params';

import _union from 'lodash-es/union';
import _kebabCase from 'lodash-es/kebabCase';
import _get from 'lodash-es/get';
import _findIndex from 'lodash-es/findIndex';
import _find from 'lodash-es/find';

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
export class SelectComponent extends AbstractComponent implements OnInit,
    OnChanges {
    @Input() protected inlineParams: Params.ISelectCParams;
    @ViewChild('selectList') protected selectList: ElementRef<HTMLElement>;
    public $params: Params.ISelectCParams;
    public control: FormControl;
    public isOpened: boolean;
    public fieldWlcElement: string;
    public activeItemIndex: number;
    public clickedOutside: boolean = false;
    public searchText: string = '';

    /**
     * get index of active option in select list
     */
    public get selectedItemIndex(): number {
        this.activeItemIndex = _findIndex(this.$params.items, (item) => {
            return item.value == this.control.value;
        });
        return this.activeItemIndex;
    };

    /**
     * Get text on selector button
     */
    public get buttonText(): string {
        return (
            this.$params.items[this.selectedItemIndex]?.title
            || this.$params.common?.placeholder
            || _get(this.$params, 'items[0].title')
        ).toString();
    }

    /**
     * get wlc-tooltip inline parameters
     */
    public get tooltipParams(): ITooltipCParams {
        return {
            inlineText: this.$params.common.tooltipText,
            modal: this.$params.common?.tooltipModal,
            modalParams: this.$params.common?.tooltipModalParams,
        };
    }

    protected constantValues: IIndexing<BehaviorSubject<Params.ISelectOptions[]>> = {};
    protected dayList = this.selectValues.getDateList('days');

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISelectCParams,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
        protected EventService: EventService,
        protected selectValues: SelectValuesService,
    ) {
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

        if (this.$params.value) {
            this.control.setValue(this.$params.value);
        }

        if (this.$params.autoSelect) {
            const country = this.configService.get<string>('appConfig.country');

            switch (this.$params.name) {
                case 'currency': {
                    const currency = this.configService.get<string>(
                        `$base.registration.selectCurrencyByCountry.${country}`,
                    );

                    if (currency && _find(this.$params.items, item => item.value === currency)) {
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
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.$params) {
            super.ngOnChanges(changes);
            this.cdr.detectChanges();
        }
    }

    /**
     * scroll select list on chosen option
     */
    public scrollSelectList(): void {
        if (this.activeItemIndex < 0) {
            return;
        }

        this.selectList?.nativeElement?.children[this.activeItemIndex].scrollIntoView({block: 'nearest'});
    }

    /**
     * toggle open close select list
     */
    public toggleDropdown(): void {
        if (this.control.status === 'DISABLED') {
            return;
        }
        this.isOpened = !this.isOpened;

        if (this.isOpened) {
            this.clickedOutside = false;
        } else {
            this.control.markAsTouched();
            this.control.updateValueAndValidity();
        }

        this.cdr.markForCheck();
    }

    /**
     * close select list
     */
    public closeDropdown(): void {
        this.control.markAsTouched();
        this.control.updateValueAndValidity();
        this.isOpened = false;
    }

    /**
     * chose option in select list and close list
     */
    public choseSelectByClick(item: Params.ISelectOptions, index: number): void {
        this.activeItemIndex = index;
        this.selectOption(item);
        this.toggleDropdown();
        this.cdr.markForCheck();
    }

    public isFieldRequired(): boolean {
        return this.$params.validators?.includes('required');
    }

    /**
     * listen event keydown and navigate on select list by this event
     */
    @HostListener('keydown', ['$event'])
    public onKeyDown(event: KeyboardEvent): void {
        if ('Tab' === event.code) {
            this.closeDropdown();
            return;
        }
        event.preventDefault();

        switch (event.code) {
            case 'Escape':
                if (this.isOpened) {
                    this.closeDropdown();
                }
                break;
            case 'ArrowUp':
                if (this.activeItemIndex < 1 || this.clickedOutside) {
                    break;
                }
                this.selectOption(this.$params.items[--this.activeItemIndex]);
                this.scrollSelectList();
                break;
            case 'ArrowDown':
                if (this.activeItemIndex === this.$params.items.length - 1 || this.clickedOutside) {
                    break;
                }
                this.selectOption(this.$params.items[++this.activeItemIndex]);
                this.scrollSelectList();
                break;
            case 'Enter':
                this.toggleDropdown();
                break;
            case 'Space':
                if (!this.isOpened) {
                    this.toggleDropdown();
                }
                break;
        }
    }

    /**
     * select option in select list
     */
    protected selectOption(item: Params.ISelectOptions): void {
        this.control.setValue(item.value);

        this.EventService.emit({
            name: `SELECT_CHOSEN_${this.$params?.name?.toUpperCase()}`,
            data: item,
        });
    }

    /**
     * get constant values from configService and selectValues by select fields names
     */
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

    /**
     * set constant values
     */
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
