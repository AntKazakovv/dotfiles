import {
    Component,
    OnInit,
    Inject,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ViewChild,
    TemplateRef,
    ElementRef,
    AfterViewInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import {
    map,
    filter,
    takeUntil,
} from 'rxjs/operators';

import {
    ActionService,
    EventService,
    ModalService,
    GlobalHelper,
    ListAppearanceAnimation,
    HeightToggleAnimation,
    ConfigService,
    ITooltipCParams,
} from 'wlc-engine/modules/core';
import {FinancesService} from 'wlc-engine/modules/finances/system/services/finances/finances.service';
import {
    IAutoSelectByDevice,
    TPaymentsMethods,
} from 'wlc-engine/modules/finances/system/interfaces';
import {PaymentSystem} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {
    IconListAbstract,
    IMerchantsPaymentsIterator,
} from 'wlc-engine/modules/core/system/classes/icon-list-abstract.class';
import {IconModel, IIconParams} from 'wlc-engine/modules/core/system/models/icon-list-item.model';
import {ThemeToDirectory} from 'wlc-engine/modules/core/system/config/base/icons.config';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './payment-list.params';

import _isUndefined from 'lodash-es/isUndefined';
import _isString from 'lodash-es/isString';
import _findIndex from 'lodash-es/findIndex';
import _forEach from 'lodash-es/forEach';
import _includes from 'lodash-es/includes';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';
import _some from 'lodash-es/some';

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
    @Input() protected lastSucceedMethod: Promise<number | null>;
    @Input() protected inlineParams: Params.IPaymentListCParams;
    @ViewChild('list') protected list: TemplateRef<any>;

    public systems: PaymentSystem[] = [];
    public items: IconModel[] = [];
    public $params: Params.IPaymentListCParams;
    public ready: boolean = false;
    public asModal: boolean;
    public showTable: boolean;
    public classList: string = '';
    public activeIcon: IconModel;
    public activeName: string = '';
    public paymentDescription: string = '';
    public useBonuses: boolean = false;
    public isCryptoInvoices: boolean;

    protected isMobile: boolean;
    protected isDeposit: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPaymentListCParams,
        protected cdr: ChangeDetectorRef,
        protected financesService: FinancesService,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected actionService: ActionService,
        protected configService: ConfigService,
        private hostRef: ElementRef,
        @Inject(WINDOW) private window: Window,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, eventService);
        this.isMobile = this.actionService.getDeviceType() === 'mobile';
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.useBonuses = this.configService.get<boolean>('$finances.bonusesInDeposit.use');
        this.isDeposit = this.$params.paymentType === 'deposit';
        this.isCryptoInvoices = this.$params.theme === 'crypto-list';

        if (this.configService.get<boolean>('$base.colorThemeSwitching.use')
        && this.$params.colorIconBg && this.$params.iconsType === 'color') {
            this.subscribeOnToggleSiteTheme(() => this.setPaymentsIconsList());
        }

        this.getPaymentSystems();
        this.followBreakpoints();

        if (this.currentSystem) {
            this.setActivePayment();
        }

    }

    public ngAfterViewInit(): void {
        this.classList = this.hostRef.nativeElement.classList.value;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['availableSystems'] && this.$params) {
            this.updatePaySystemsStatus();
        }

        if (changes['currentSystem']) {
            this.setActivePayment();
        }
    }

    public systemTrackBy(index: number, system: PaymentSystem): string {
        return String(index) + String(system.id) + system.name;
    }

    public selectPayment(system: PaymentSystem, clearSame: boolean = this.useBonuses): void {
        if (system.disabledBy) {
            return;
        }

        const chosenSystem: PaymentSystem = system.id === this.currentSystem?.id && clearSame ? null : system;

        this.eventService.emit({
            name: 'select_system',
            from: 'finances',
            data: chosenSystem,
        });

        if (this.$params.hideModalOnSelect
            && system.id !== this.currentSystem?.id
            && this.modalService.getActiveModal('payment-list')) {
            this.modalService.hideModal('payment-list');
        }

        this.paymentDescription = this.isDeposit
            ? system.description
            : system.descriptionWithdraw;

        this.cdr.markForCheck();
    }

    public openModal(): void {
        this.modalService.showModal({
            id: 'payment-list',
            modalTitle: this.$params.modalTitle,
            templateRef: this.list,
            size: this.$params.modalSize,
        });
    }

    public getErrTooltipParams(systemIndex: number): ITooltipCParams {
        return {
            inlineText: this.systems[systemIndex].disabledReason,
            themeMod: 'error',
            bsTooltipMod: 'error',
            iconName: 'blocked',
        };
    }

    protected setActivePayment(): void {
        const index = _findIndex(this.systems, (item) => item.id === this.currentSystem?.id);

        if (index !== -1) {
            this.activeIcon = this.items[index];
            this.activeName = this.systems[index].name;
        }
    }

    protected getPaymentSystems(): void {
        this.financesService.paymentSystems$.pipe(
            filter((systems) => !!systems),
            map(
                (systems) =>
                    systems.filter(
                        (system) => this.financesService.filterSystemsPipe(system, this.$params.paymentType),
                    ),
            ),
            takeUntil(this.$destroy),
        ).subscribe((systems: PaymentSystem[]): void => {
            if (this.isDeposit && this.isCryptoInvoices) {
                systems = systems.filter((system: PaymentSystem) => system.cryptoInvoices);
            } else if (this.isDeposit && _some(systems, {cryptoInvoices: true})) {
                systems = this.financesService.updateForCryptoInvoices(systems);
            }

            this.ready = true;
            this.processSystemsResponse(systems);
        });
    }

    protected async processSystemsResponse(systems: PaymentSystem[]): Promise<void> {
        this.systems = systems;
        this.setPaymentsIconsList();

        if (this.useBonuses) {
            this.updatePaySystemsStatus();
        }

        let last: number | null;
        if (this.lastSucceedMethod) {
            last = await this.lastSucceedMethod;
            this.lastSucceedMethod = null;
        }

        if (this.currentSystem || last) {
            const system: PaymentSystem = _find(this.systems, (system: PaymentSystem): boolean => {
                return system.id === this.currentSystem?.id
                    || system.id === last
                    || (system.isParent && _some(system.children, {id: last}));
            });

            if (system) {
                this.selectPayment(system, false);
            } else {
                this.eventService.emit({
                    name: 'select_system',
                    from: 'finances',
                    data: null,
                });
            }
        } else if (this.systems.length === 1 && !this.systems[0].disabledBy) {
            this.selectPayment(this.systems[0], false);
        } else if (this.systems.length > 1 && this.configService.get<boolean>('$finances.payment.autoSelect')) {
            this.selectPayment(this.getAutoSelected(), false);
        }

        this.cdr.markForCheck();
    }

    /**
     * Метод проверяет в конфиге название алиаса, его номер в списке (в том числе обратный) или объект
     * Если в объекте указан только один девайс, то для второго автоматический выбор не сработает
     * @returns PaymentSystem | null
     */

    protected getAutoSelected(): PaymentSystem | null {
        let alias: string | number | IAutoSelectByDevice<number | string> =
            this.configService.get('$finances.payment.alias');

        if (typeof(alias) === 'object') {
            alias = this.isMobile ? alias.mobile : alias.desktop;
        }

        const enabled: PaymentSystem[] = _filter(this.systems, (s: PaymentSystem) => !s.disabledBy);

        if (typeof(alias) === 'number') {
            const index: number = (alias > 0) ? alias - 1 : this.systems.length + alias;
            return enabled[index] || enabled[0];
        }

        if (typeof(alias) === 'string')  {
            return enabled.find((system: PaymentSystem) => system.alias === alias) || enabled[0];
        }

        return null;
    }

    protected setPaymentsIconsList(): void {
        const {iconsType, colorIconBg} = this.$params;
        const showAs = iconsType === 'black' ? 'svg' : 'img';

        this.items = this.convertItemsToIconModel<PaymentSystem>(
            this.systems,
            (item: PaymentSystem) => {
                return {
                    from: {
                        component: 'PaymentListComponent',
                        method: 'setPaymentsIconsList',
                    },
                    icon: this.isCryptoInvoices
                        ? this.cryptoIterator(item)
                        : this.merchantsPaymentsIterator('payments', {
                            showAs: showAs,
                            wlcElement: 'block_payment-' + this.wlcElementTail(item.alias),
                            nameForPath: item.alias,
                            alt: item.name,
                            colorIconBg: colorIconBg,
                            imgPath: this.isDeposit
                                ? item.image
                                : (item.imageWithdraw || item.image),
                            defaultImages: item.defaultImages,
                            paymentType: this.$params.paymentType,
                        }),
                };
            },
        );
        this.cdr.markForCheck();
    }

    protected cryptoIterator(system: PaymentSystem): IIconParams {
        return {
            showAs: 'img',
            iconUrl: `gstatic/wlc/icons/currencies/${system.cryptoTicker?.toLowerCase() || 'def'}.svg`,
            alt: system.cryptoTicker || system.name,
        };
    }

    protected merchantsPaymentsIterator(pathDirectory: keyof typeof ThemeToDirectory,
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

        if (!_isUndefined(asModal)) {
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
        }

        if (!_isUndefined(showTable)) {
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
            system.disabledBy = !this.availableSystems.length
                || _includes(this.availableSystems, system.id)
                || system.id < 0
                ? null : 1;
        });
    }
}
