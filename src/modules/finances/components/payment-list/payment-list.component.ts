import {Component, OnInit, Inject, Input, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';

import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {EventService} from 'wlc-engine/modules/core/system/services';
import {FinancesService} from 'wlc-engine/modules/finances/system/services';
import {PaymentSystem} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {map, filter, tap} from 'rxjs/operators';

import * as Params from './payment-list.params';

@Component({
    selector: '[wlc-payment-list]',
    templateUrl: './payment-list.component.html',
    styleUrls: ['./payment-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentListComponent extends AbstractComponent implements OnInit {

    public systems: PaymentSystem[] = [];
    public $params: Params.IPaymentListParams;
    public ready: boolean = false;
    @Input() public currentSystem: PaymentSystem;
    @Input() protected inlineParams: Params.IPaymentListParams;

    constructor(
        @Inject('injectParams') protected params: Params.IPaymentListParams,
        protected cdr: ChangeDetectorRef,
        protected financesService: FinancesService,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<Params.IPaymentListParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.financesService.paymentSystems$.pipe(
            tap((systems) => console.log(systems)),
            filter((systems) => !!systems),
            map(
                (systems) =>
                    systems.filter(
                        (system) => this.financesService.filterSystemsPipe(system, this.$params.paymentType),
                    ),
            ),
        ).subscribe((systems) => {
            console.log('ss', systems);
            this.ready = true;
            this.systems = systems;
            this.cdr.markForCheck();
        });
    }

    public selectPayment(system: PaymentSystem): void {

        this.eventService.emit({
            name: 'select_system',
            from: 'finances',
            data: system,
        });
    }

}
