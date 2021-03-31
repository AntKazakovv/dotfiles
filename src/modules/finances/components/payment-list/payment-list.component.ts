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
} from '@angular/core';
import {
    map,
    filter,
    takeUntil,
} from 'rxjs/operators';
import {
    Observable,
    fromEvent,
    fromEventPattern,
} from 'rxjs';
import {
    animate,
    style,
    transition,
    trigger,
    query,
    stagger,
} from '@angular/animations';

import {
    AbstractComponent,
    ActionService,
    EventService,
    ModalService,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {FinancesService} from 'wlc-engine/modules/finances/system/services';
import {PaymentSystem} from 'wlc-engine/modules/finances/system/models/payment-system.model';

import * as Params from './payment-list.params';

import {
    isUndefined as _isUndefined,
    isString as _isString,
} from 'lodash-es';


@Component({
    selector: '[wlc-payment-list]',
    templateUrl: './payment-list.component.html',
    styleUrls: ['./styles/payment-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('appearance', [
            transition('*<=>*', [
                query(':enter', [
                    style({opacity: 0}),
                    stagger('0.03s', animate('0.8s', style({opacity: 1}))),
                ]),
            ]),
        ]),
    ],
})
export class PaymentListComponent extends AbstractComponent implements OnInit {

    public systems: PaymentSystem[] = [];
    public $params: Params.IPaymentListCParams;
    public ready: boolean = false;
    public asModal: boolean;
    public showTable: boolean;

    @Input() public currentSystem: PaymentSystem;
    @Input() protected inlineParams: Params.IPaymentListCParams;

    @ViewChild('list') protected list: TemplateRef<any>;

    constructor(
        @Inject('injectParams') protected params: Params.IPaymentListCParams,
        protected cdr: ChangeDetectorRef,
        protected financesService: FinancesService,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected actionService: ActionService,
        protected hostRef: ElementRef,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.getPaymentSystems();
        this.followBreakpoints();
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

    public getIcon(name: string): string {
        const snakeName = GlobalHelper.toSnakeCase(name);
        if (this.$params.iconsType === 'svg') {
            return `/paysystems/V2/svg/black/${snakeName}.svg`;
        }
        return `/paysystems/V2/png/color/${snakeName}.png`;
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

            if (this.currentSystem && !this.systems.some((s) => s.id === this.currentSystem.id)) {
                this.eventService.emit({
                    name: 'select_system',
                    from: 'finances',
                });
            }
            this.cdr.markForCheck();
        });
    }

    /**
     *
     */
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
