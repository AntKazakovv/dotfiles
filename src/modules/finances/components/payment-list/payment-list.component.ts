import {
    Component,
    OnInit,
    Inject,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    TemplateRef,
    ElementRef,
    AfterViewInit,
    OnChanges,
    SimpleChanges,
    ViewChild,
    Injector,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {DateTime} from 'luxon';
import {
    map,
    filter,
    takeUntil,
    tap,
} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import _isString from 'lodash-es/isString';
import _findIndex from 'lodash-es/findIndex';
import _forEach from 'lodash-es/forEach';
import _includes from 'lodash-es/includes';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';
import _some from 'lodash-es/some';
import _orderBy from 'lodash-es/orderBy';
import _every from 'lodash-es/every';
import _map from 'lodash-es/map';

import {
    ActionService,
    EventService,
    ModalService,
    GlobalHelper,
    ListAppearanceAnimation,
    HeightToggleAnimation,
    ConfigService,
    ITooltipCParams,
    IWrapperCParams,
    ColorThemeService,
    TIconColorBg,
    LogService,
} from 'wlc-engine/modules/core';
import {MediaQueries} from 'wlc-engine/modules/core/constants';
import {UserInfo} from 'wlc-engine/modules/user';
import {
    IconModel,
    IIconParams,
    TIconErrorCode,
    IconListAbstract,
    IMerchantsPaymentsIterator,
    IIconListItemCParams,
} from 'wlc-engine/modules/icon-list';
import {FinancesService} from 'wlc-engine/modules/finances/system/services/finances/finances.service';
import {
    IAutoSelectByDevice,
    IPaySystemCategories,
    IFinancesConfig,
    TPaymentsMethods,
    TPaySystemsSwitcher,
    TPaySystemTagAll,
} from 'wlc-engine/modules/finances/system/interfaces';
import {PaymentSystem} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {ThemeToDirectory} from 'wlc-engine/modules/core/system/config/base/icons.config';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {
    IMenuCParams,
    IMenuItem,
} from 'wlc-engine/modules/menu/components/menu/menu.params';
import {FinancesHelper} from 'wlc-engine/modules/finances/system/helpers/finances.helper';
import {
    CustomAsyncHook,
    CustomHook,
} from 'wlc-engine/modules/core/system/decorators/hook.decorator';

import * as Params from './payment-list.params';

interface IPaymentsIterator extends IMerchantsPaymentsIterator {
    imgPath: string;
    defaultImages: string[];
    paymentType: TPaymentsMethods;
}

@Component({
    selector: '[wlc-payment-list]',
    templateUrl: './payment-list.component.html',
    styleUrls: ['./styles/payment-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        ...ListAppearanceAnimation,
        ...HeightToggleAnimation,
    ],
})
export class PaymentListComponent extends IconListAbstract<Params.IPaymentListCParams>
    implements OnInit, AfterViewInit, OnChanges {

    @Input() public currentSystem: PaymentSystem;
    @Input() public availableSystems: number[];
    @Input() public userCountry: string;
    @Input() protected lastSucceedMethod: Promise<number | null>;
    @Input() protected isFetchingSystems: boolean = false;
    @Input() protected inlineParams: Params.IPaymentListCParams;
    @Input() protected skipAutoSelect: boolean = false;
    @ViewChild('list') protected list: TemplateRef<any>;

    public override $params: Params.IPaymentListCParams;

    public systems: PaymentSystem[] = [];
    public systems$: BehaviorSubject<PaymentSystem[]> = new BehaviorSubject(null);
    public itemsMap: Map<number, IWrapperCParams> = new Map([]);

    public ready: boolean = false;
    public asModal: boolean;
    public showTable: boolean;
    public classList: string = '';
    public activeIcon: IWrapperCParams;
    public activeName: string = '';
    public useBonuses: boolean = false;
    public useTags: boolean = false;
    public isGroupingByBlocks: boolean = false;
    public tagsConfig: IPaySystemCategories;
    public tags: [TPaySystemTagAll, string][] = [];
    public tagsControl: UntypedFormControl = new UntypedFormControl();
    public tagsMenuConfig: IWrapperCParams;
    public showTagsDropDown: boolean = false;
    public dropdownCatMenu: boolean = false;
    public isCryptoInvoices: boolean;
    public activeTag$: BehaviorSubject<TPaySystemTagAll> = new BehaviorSubject(null);
    public catMenuTypeMain: TPaySystemsSwitcher;
    public logImageError: TIconErrorCode = '1.4.18';
    public paymentCategories: Params.IPaymentsGroup[] = [];
    public selectedParentID: number;

    protected isDeposit: boolean;
    protected lastSucceedRes: number | null = null;
    protected isAutoSelect: boolean;
    protected useScroll: boolean = false;

    private isActualUserTerms: boolean = true;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPaymentListCParams,
        @Inject(WINDOW) protected window: Window,
        cdr: ChangeDetectorRef,
        protected injector: Injector, //added for custom-hook
        protected financesService: FinancesService,
        protected eventService: EventService,
        colorThemeService: ColorThemeService,
        protected modalService: ModalService,
        protected actionService: ActionService,
        configService: ConfigService,
        private hostRef: ElementRef,
        protected logService: LogService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, colorThemeService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.isDeposit = this.$params.paymentType === 'deposit';
        this.isAutoSelect = this.configService.get<boolean>('$finances.payment.autoSelect');
        this.useBonuses = this.configService.get<boolean>('$finances.bonusesInDeposit.use');
        this.isCryptoInvoices = this.isDeposit && this.$params.theme === 'crypto-list';
        this.tagsConfig = this.configService.get<IPaySystemCategories>('$finances.paySystemCategories');
        this.useTags = this.tagsConfig.use
            && ((this.isDeposit ? this.tagsConfig.useFor === 'deposit' : this.tagsConfig.useFor === 'withdraw')
                || this.tagsConfig.useFor === 'both')
            && this.$params.theme !== 'crypto-list';
        this.useScroll = this.configService.get<boolean>('$finances.usePaySystemScroll');
        this.followBreakpoints();

        if (this.configService.get<boolean>('$base.colorThemeSwitching.use')
            && this.$params.colorIconBg
            && this.$params.iconsType === 'color'
            && !this.$params.ignoreAltTheme) {
            this.subscribeOnToggleSiteTheme(() => this.setPaymentsIconsList());
        }

        if (this.useTags) {
            this.catMenuTypeMain = this.tagsConfig.desktopMenuType
                || (this.configService.get('$base.profile.type') === 'first' ? 'select' : 'menu');

            this.isGroupingByBlocks = this.catMenuTypeMain === 'blocks';

            this.tagsControl.valueChanges.pipe(
                tap(() => this.onTagChange()),
                takeUntil(this.$destroy),
            ).subscribe();
        }

        const newTermsVersion: string = this.configService.get<IFinancesConfig>('$finances').newTermsVersion;

        if (newTermsVersion) {
            this.configService
                .get<BehaviorSubject<UserInfo>>('$user.userInfo$')
                .pipe(takeUntil(this.$destroy))
                .subscribe((userInfo: UserInfo) => {
                    const isCheckUserTermsVersion: boolean = this.checkTermsVersion(
                        userInfo.currentTermsVersion,
                        userInfo.getTermsVersion(newTermsVersion),
                    );

                    if (this.isActualUserTerms !== isCheckUserTermsVersion && this.systems) {
                        this.isActualUserTerms = isCheckUserTermsVersion;
                        this.processSystemsResponse(this.systems);
                    }
                });
        }

        this.getPaymentSystems();

        if (this.currentSystem) {
            this.setActivePayment();
        }

    }

    public ngAfterViewInit(): void {
        this.classList = this.hostRef.nativeElement.classList.value;
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        if (changes['availableSystems'] && this.$params) {
            this.updatePaySystemsStatus();
        }

        if (changes['isFetchingSystems']) {
            this.ready = !this.isFetchingSystems;
        }

        if (changes['currentSystem']) {
            this.setActivePayment();
        }
    }

    public systemTrackBy(index: number, system: PaymentSystem): string {
        return String(index) + String(system.id) + system.name;
    }

    @CustomHook('finances', 'customSelectPayment')
    public selectPayment(
        system: PaymentSystem | null,
        clearSame: boolean = this.useBonuses,
        hideModal: boolean = this.$params.hideModalOnSelect,
        autoSelect: boolean = false,
    ): void {

        if (system?.isParent) {
            this.selectedParentID = system.id;
        } else if (this.$params.theme !== 'crypto-list') {
            this.selectedParentID = null;
        }

        if (system?.disabledBy) {
            return;
        }

        if (system) {
            system.autoSelect = autoSelect;
        }

        const chosenSystem: PaymentSystem | null = system?.id === this.currentSystem?.id && clearSame ? null : system;

        this.eventService.emit({
            name: 'select_system',
            from: 'finances',
            data: chosenSystem,
        });

        if (system && hideModal && system.id !== this.currentSystem?.id
            && this.modalService.getActiveModal('payment-list')) {
            this.modalService.hideModal('payment-list');
        }

        this.cdr.markForCheck();
    }

    @CustomHook('finances', 'customOpenModal')
    public openModal(): void {
        this.modalService.showModal({
            id: 'payment-list',
            modalTitle: this.$params.modalTitle,
            templateRef: this.list,
            size: this.$params.modalSize,
        });
    }

    public getErrTooltipParams(system: PaymentSystem): ITooltipCParams {
        return {
            inlineText: system.disabledReason,
            themeMod: 'error',
            bsTooltipMod: 'error',
            iconName: 'blocked',
        };
    }

    /** Toggle visibility of tags list */
    public toggleTags(): void {
        this.showTagsDropDown = !this.showTagsDropDown;
    }

    /** Set active tag */
    public setActiveTag(tag: TPaySystemTagAll): void {
        if (tag === this.tagsControl.value) {
            return;
        }

        this.tagsControl.patchValue(tag, {
            emitEvent: true,
            emitModelToViewChange: true,
            emitViewToModelChange: true,
        });

        this.showTagsDropDown = false;
    }

    public get activeTagName(): string {
        return this.tagsConfig.categoriesConfig[this.tagsControl.value]?.name;
    }

    public get catMenuType(): 'desktop' | 'dropdown' {
        return this.dropdownCatMenu || this.asModal ? 'dropdown' : 'desktop';
    }

    public showNotifications(systems: PaymentSystem[], userCountry: string, theme: string): boolean {
        return (!systems.length || !userCountry) && theme !== 'crypto-list';
    }

    public get paymentDescription(): string {
        let description: string = '';

        if (this.currentSystem) {
            description = this.isDeposit ? this.currentSystem.description : this.currentSystem.descriptionWithdraw;
        }

        return description;
    }

    public get showDescription(): boolean {
        return this.currentSystem.cryptoInvoices && this.$params.theme === 'crypto-list'
            || !this.currentSystem.cryptoInvoices;
    }

    public getIconUrl(itemsMap: Map<number, IWrapperCParams>, system: PaymentSystem): string {
        return (itemsMap.get(system.id).components[0].params as IIconListItemCParams).icon.image;
    }

    protected checkTermsVersion(currentTermsVersion: string | DateTime, newTermsVersion: string | DateTime): boolean {
        if (currentTermsVersion instanceof DateTime && newTermsVersion instanceof DateTime) {
            return currentTermsVersion >= newTermsVersion;
        } else if (typeof currentTermsVersion === 'string' && typeof newTermsVersion === 'string') {
            return Number(currentTermsVersion) >= Number(newTermsVersion);
        } else {
            this.logService.sendLog({
                code: '17.7.0',
                data: 'Wrong Terms version format in finances config',
            });
            console.error('Wrong Terms version format in finances config');
            return true;
        }
    }

    protected onTagChange(): void {
        this.activeTag$.next(this.tagsControl.value);
        this.systems$.next(this.systems.filter((val) => val.tags.includes(this.tagsControl.value)));

        if (this.systems$.getValue().length) {
            const current: PaymentSystem = (this.lastSucceedRes || this.currentSystem) && this.systems$.getValue()
                .find((system: PaymentSystem) => {
                    return system.id === this.currentSystem?.id
                        || system.id === this.lastSucceedRes
                        || system.isParent && system.children.find((sys: PaymentSystem) => {
                            return sys.id === this.currentSystem?.id
                                || sys.id === this.lastSucceedRes;
                        });
                });

            if (current) {

                if (current?.id !== this.currentSystem?.id) {
                    this.selectPayment(current, false, false);
                }

            } else if (this.isAutoSelect) {

                if (this.currentSystem?.isParent) {
                    this.selectPayment(null, undefined, false, true);
                }

                this.selectPayment(this.systems$.getValue().find(s => !s.disabledBy), true, false);

            } else if (this.currentSystem
                && !this.systems$.getValue().find(s => s.id === this.currentSystem?.id)) {

                if (this.currentSystem?.isParent) {
                    this.selectPayment(null, undefined, false);
                }

                this.selectPayment(null, undefined, false);
            }
        }
    }

    protected setActivePayment(): void {
        const index = _findIndex(this.systems, (item) => item.id === this.currentSystem?.id);

        if (index !== -1) {
            const activeIconModel: IconModel = this.itemsMap.get(this.currentSystem.id).components[0].params['icon'];
            this.activeIcon = {
                components: [
                    {
                        name: 'icon-list.wlc-icon-list-item',
                        params: {
                            icon: activeIconModel,
                            class: this.$class + '-item',
                        },
                    },
                ],
            };
            this.activeName = this.systems[index].name;
        }

        this.cdr.markForCheck();
    }

    protected getPaymentSystems(): void {
        this.financesService.paymentSystems$.pipe(
            filter((systems) => !!systems),
            map((systems) => this.mapByMode(systems)),
            tap((systems) => this.tapToTags(systems)),
            map((systems) => this.mapForInvoices(systems)),
            takeUntil(this.$destroy),
        ).subscribe((systems: PaymentSystem[]): void => {
            this.ready = true;
            this.processSystemsResponse(systems);
        });
    }

    @CustomAsyncHook('finances', 'customProcessSystemsResponse')
    protected async processSystemsResponse(systems: PaymentSystem[]): Promise<void> {

        if (this.isActualUserTerms) {
            this.systems = systems.filter((system) => !system.checkTermsVersion);
        } else {
            this.systems = systems.filter((system) => system.checkTermsVersion);
        }

        this.setPaymentsIconsList();

        if (this.useTags) {
            this.systems$.next(this.systems.filter((val) => val.tags.includes(this.tagsControl.value)));
            this.setPaymentCategories();
        } else {
            this.systems$.next(this.systems);
        }

        if (this.useBonuses) {
            this.updatePaySystemsStatus();
        }

        let last: number | null;
        if (this.lastSucceedMethod) {
            last = this.lastSucceedRes = await this.lastSucceedMethod;
            this.lastSucceedMethod = null;
        }

        const system: PaymentSystem = (this.currentSystem || last) && _find(
            this.systems, (system: PaymentSystem): boolean => {
                return system.id === this.currentSystem?.id
                    || system.id === last
                    || (system.isParent && _some(system.children, {id: last}));
            });

        if (system) {
            const tag: TPaySystemTagAll | false = last && this.useTags
                && this.tags.find((tag) => system.tags.includes(tag[0]))?.[0] || false;

            if (tag) {
                this.setActiveTag(tag);
            }

            if (!this.skipAutoSelect) {
                this.selectPayment(system, false, false, true);
            }
        } else if (
            this.systems$.getValue().length === 1
            && !this.systems$.getValue()[0].disabledBy
            && !this.skipAutoSelect
        ) {
            this.selectPayment(this.systems$.getValue()[0], false, false, true);
        } else if (this.systems$.getValue().length > 1 && this.isAutoSelect) {
            this.selectPayment(this.getAutoSelected(), false, false, true);
        }

        this.cdr.detectChanges();
    }

    protected mapForInvoices(systems: PaymentSystem[]): PaymentSystem[] {
        if (this.isCryptoInvoices) {
            return systems.filter((system: PaymentSystem) => system.cryptoInvoices);
        } else if (this.isDeposit && _some(systems, {cryptoInvoices: true})) {
            return this.financesService.updateForCryptoInvoices(systems);
        }
        return systems;
    }

    protected tapToTags(systems: PaymentSystem[]): void {
        if (!this.useTags || !systems.length) {
            return;
        }

        this.tags = _orderBy(
            FinancesHelper.collectTags(systems),
            (tag: TPaySystemTagAll) => this.tagsConfig.categoriesConfig[tag].order,
            'desc').map((tag) => [tag, this.tagsConfig.categoriesConfig[tag].name]);

        this.setTagsMenuConfig();

        if (!this.tagsControl.value) {
            this.tagsControl.markAsTouched();
            this.tagsControl.patchValue(this.tags[0][0], {
                emitEvent: true,
                emitModelToViewChange: true,
                emitViewToModelChange: true,
            });
        }
    }

    protected setTagsMenuConfig(): void {
        this.tagsMenuConfig = this.catMenuTypeMain === 'menu' ? {
            components: [{
                name: 'menu.wlc-menu',
                params: <IMenuCParams>{
                    theme: 'submenu',
                    items: this.tags.map(([tag, title]): IMenuItem => {
                        return {
                            name: title,
                            class: `tag-${tag}`,
                            type: 'action',
                            params: {
                                action: {
                                    isActive: this.activeTag$.pipe(
                                        map(() => this.tagsControl.value === tag),
                                        takeUntil(this.$destroy),
                                    ),
                                    emit: this.setActiveTag.bind(this, tag),
                                },
                            },
                        };
                    }),
                },
            }],
        } : {
            components: [{
                name: 'core.wlc-select',
                params: {
                    name: 'paymentTags',
                    updateOnControlChange: true,
                    control: this.tagsControl,
                    labelText: gettext('Payment Methods'),
                    items: this.tags.map(([value, title]) => {
                        return {
                            value,
                            title,
                        };
                    }),
                },
            }],
        };
    }

    protected setPaymentCategories(): void {
        this.paymentCategories = _map(this.tags, (item) => {
            const systemsList: PaymentSystem[] = _filter(this.systems, (s: PaymentSystem) => {
                return _includes(s.tags, item[0]);
            });

            return {
                tag: item[0],
                title: item[1],
                systems: systemsList,
            };
        });
    }

    protected mapByMode(systems: PaymentSystem[]): PaymentSystem[] {
        return systems.filter((system: PaymentSystem): boolean => {
            return this.financesService.filterSystemsPipe(system, this.$params.paymentType);
        });
    }

    /**
     * Метод проверяет в конфиге название алиаса, его номер в списке (в том числе обратный) или объект
     * Если в объекте указан только один девайс, то для второго автоматический выбор не сработает
     * @returns PaymentSystem | null
     */

    protected getAutoSelected(): PaymentSystem | null {
        let alias: string | number | IAutoSelectByDevice<number | string> =
            this.configService.get('$finances.payment.alias');

        if (typeof (alias) === 'object') {
            alias = this.actionService.getDeviceType() === 'mobile' ? alias.mobile : alias.desktop;
        }

        const enabled: PaymentSystem[] = _filter(this.systems$.getValue(), (s: PaymentSystem) => !s.disabledBy);

        if (typeof (alias) === 'number') {
            const index: number = (alias > 0) ? alias - 1 : this.systems$.getValue().length + alias;
            return enabled[index] || enabled[0];
        }

        if (typeof (alias) === 'string') {
            return enabled.find((system: PaymentSystem) => system.alias === alias) || enabled[0];
        }

        return null;
    }

    protected setPaymentsIconsList(): void {
        const {iconsType, colorIconBg} = this.$params;
        const showAs = iconsType === 'black' ? 'svg' : 'img';

        this.systems.forEach((item: PaymentSystem): void => {
            this.itemsMap.set(item.id, this.setIcon(item, showAs, colorIconBg));
        });

        this.cdr.markForCheck();
    }

    protected setIcon(item: PaymentSystem, showAs: 'svg' | 'img', bg: TIconColorBg): IWrapperCParams {
        return {
            components: [
                {
                    name: 'icon-list.wlc-icon-list-item',
                    params: {
                        icon: new IconModel(
                            {
                                component: 'PaymentListComponent',
                                method: 'setPaymentsIconsList',
                            },
                            this.isCryptoInvoices
                                ? this.cryptoIterator(item)
                                : this.merchantsPaymentsIterator('payments', {
                                    showAs: showAs,
                                    wlcElement: 'block_payment-' + this.wlcElementTail(item.alias),
                                    nameForPath: item.alias,
                                    alt: item.name,
                                    colorIconBg: bg,
                                    imgPath: this.isDeposit
                                        ? item.image
                                        : (item.imageWithdraw || item.image),
                                    defaultImages: item.defaultImages,
                                    paymentType: this.$params.paymentType,
                                }),
                        ),
                        class: this.$class + '-item',
                        logImageErrorChild: this.logImageError,
                    },
                },
            ],
        };
    }

    protected cryptoIterator(system: PaymentSystem): IIconParams {
        return {
            showAs: 'img',
            iconUrl: `/wlc/icons/currencies/${system.cryptoTicker?.toLowerCase() || 'def'}.svg`,
            alt: system.cryptoTicker || system.name,
        };
    }

    protected override merchantsPaymentsIterator(pathDirectory: keyof typeof ThemeToDirectory,
        params: IPaymentsIterator,
    ): IIconParams {
        const res = super.merchantsPaymentsIterator(pathDirectory, params);
        const imageType = this.isDeposit ? 'image' : 'image_withdraw';

        if (!params.defaultImages.includes(imageType)) {
            res.iconUrl = params.imgPath;
        }

        return res;
    }

    protected followBreakpoints(): void {
        const {asModal, showTable} = this.$params;

        if (asModal) {
            if (_isString(asModal)) {
                const breakpoint = this.window.matchMedia(asModal as string);
                this.asModal = breakpoint.matches;
                GlobalHelper.mediaQueryObserver(breakpoint)
                    .pipe(takeUntil(this.$destroy))
                    .subscribe((event: MediaQueryListEvent) => {
                        this.asModal = event.matches;
                        this.cdr.markForCheck();
                    });
            } else {
                this.actionService.deviceType()
                    .pipe(takeUntil(this.$destroy))
                    .subscribe((type) => {
                        this.asModal = asModal === type;
                        this.cdr.markForCheck();
                    });
            }

        } else if (this.useTags && this.tagsConfig.dropdownBefore) {
            if (MediaQueries.minOrMax.test(this.tagsConfig.dropdownBefore)) {
                const bp: MediaQueryList = this.window.matchMedia(this.tagsConfig.dropdownBefore);
                this.dropdownCatMenu = bp.matches;
                GlobalHelper.mediaQueryObserver(bp)
                    .pipe(takeUntil(this.$destroy))
                    .subscribe((event: MediaQueryListEvent) => {
                        this.dropdownCatMenu = event.matches;
                        this.cdr.markForCheck();
                    });
            } else {
                console.error('Media query is incorrect. '
                    + '$finances.paySystemCategories.dropdownBefore: '
                    + this.tagsConfig.dropdownBefore);
            }
        }

        if (showTable) {
            if (_isString(showTable)) {
                const breakpoint = this.window.matchMedia(showTable as string);
                this.showTable = breakpoint.matches;
                GlobalHelper.mediaQueryObserver(breakpoint)
                    .pipe(takeUntil(this.$destroy))
                    .subscribe((event: MediaQueryListEvent) => {
                        this.showTable = event.matches;
                        this.cdr.markForCheck();
                    });
            } else {
                this.actionService.deviceType()
                    .pipe(takeUntil(this.$destroy))
                    .subscribe((type) => {
                        this.showTable = showTable === type;
                        this.cdr.markForCheck();
                    });
            }
        }
    }

    protected updatePaySystemsStatus(): void {
        _forEach(this.systems, (system: PaymentSystem): void => {
            system.disabledBy = !this.availableSystems?.length
                || system.childrenSystems.length
                && !_every(system.childrenSystems, child => !_includes(this.availableSystems, child.id))
                || _includes(this.availableSystems, system.id)
                ? null : 1;
        });
    }

    protected getPaymentName(system: PaymentSystem): string {
        if (this.isDeposit) {
            return system.name;
        }

        return system.nameWithdraw;
    }
}
