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
    ConfigService,
} from 'wlc-engine/modules/core';
import {FinancesService} from 'wlc-engine/modules/finances/system/services';
import {PaymentSystem} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {IconListAbstract} from 'wlc-engine/modules/core/system/classes/icon-list-abstract.class';
import {IconModel} from 'wlc-engine/modules/core/system/models/icon-list-item.model';

import * as Params from './payment-list.params';

import _isUndefined from 'lodash-es/isUndefined';
import _isString from 'lodash-es/isString';
import _findIndex from 'lodash-es/findIndex';

@Component({
    selector: '[wlc-payment-list]',
    templateUrl: './payment-list.component.html',
    styleUrls: ['./styles/payment-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        ...ListAppearanceAnimation,
    ],
})
export class PaymentListComponent extends IconListAbstract<Params.IPaymentListCParams>
    implements OnInit, AfterViewInit, OnChanges {

    public systems: PaymentSystem[] = [];
    public items: IconModel[] = [];
    public $params: Params.IPaymentListCParams;
    public ready: boolean = false;
    public asModal: boolean;
    public showTable: boolean;
    public classList: string = '';
    public activeIcon: IconModel;

    @Input() public currentSystem: PaymentSystem;
    @Input() protected inlineParams: Params.IPaymentListCParams;

    @ViewChild('list') protected list: TemplateRef<any>;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPaymentListCParams,
        protected cdr: ChangeDetectorRef,
        protected financesService: FinancesService,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected actionService: ActionService,
        protected configService: ConfigService,
        private hostRef: ElementRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.getPaymentSystems();
        this.followBreakpoints();

        if (this.currentSystem) {
            this.setActiveIcon();
        }
    }

    public ngAfterViewInit(): void {
        this.classList = this.hostRef.nativeElement.classList.value;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['currentSystem']) {
            this.setActiveIcon();
        }
    }

    public selectPayment(system: PaymentSystem): void {
        this.eventService.emit({
            name: 'select_system',
            from: 'finances',
            data: system,
        });

        if (this.$params.hideModalOnSelect) {
            this.modalService.hideModal('payment-list');
        }

        this.cdr.markForCheck();
    }

    public openModal(): void {
        this.modalService.showModal({
            id: 'payment-list',
            templateRef: this.list,
            size: this.$params.modalSize,
        });
    }

    protected setActiveIcon(): void {
        const index = _findIndex(this.systems, (item) => item.id === this.currentSystem.id);
        this.activeIcon = this.items[index];
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
        ).subscribe((systems) => {
            this.ready = true;
            this.systems = systems;
            this.setPaymentsIconsList();

            if (this.currentSystem && !this.systems.some((s) => s.id === this.currentSystem.id)) {
                this.eventService.emit({
                    name: 'select_system',
                    from: 'finances',
                });
            }
            this.cdr.markForCheck();
        });
    }


    protected setPaymentsIconsList(): void {
        const {iconsType, colorIconBg} = this.$params;
        const showAs = iconsType === 'black' ? 'svg' : 'img';

        this.setItemsList<PaymentSystem>(this.systems, (item) => this.merchantsPaymentsIterator('payments', {
            showAs: showAs,
            wlcElement: 'block_payment-' + this.wlcElementTail(item.name),
            nameForPath: item.name,
            colorIconBg: colorIconBg,
        }));
    }

    protected followBreakpoints(): void {
        const {asModal, showTable} = this.$params;

        if (!_isUndefined(asModal)) {
            if (_isString(asModal)) {
                const breakpoint = window.matchMedia(asModal as string);
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
                const breakpoint = window.matchMedia(showTable as string);
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
}
