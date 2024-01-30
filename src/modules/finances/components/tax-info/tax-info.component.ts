import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';

import {takeUntil} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {FinancesService} from 'wlc-engine/modules/finances/system/services';
import {TaxModel} from 'wlc-engine/modules/finances/system/models';

import * as Params from './tax-info.params';

@Component({
    selector: '[wlc-tax-info]',
    templateUrl: './tax-info.component.html',
    styleUrls: ['./styles/tax-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TaxInfoComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ITaxInfoCParams;

    public override $params: Params.ITaxInfoCParams;
    public tax: number = 0;
    public totalAmount: number = 0;
    public isError: boolean = false;

    private taxes: TaxModel;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITaxInfoCParams,
        protected override configService: ConfigService,
        protected override cdr: ChangeDetectorRef,
        protected financesService: FinancesService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.taxes = this.financesService.taxes || await this.financesService.getTaxes();

        if (this.taxes) {
            this.$params.amount$?.pipe(takeUntil(this.$destroy)).subscribe((amount) => {
                this.updateTaxes(amount);
            });
        } else {
            this.isError = true;
            this.cdr.markForCheck();
        }
    }

    protected updateTaxes(amount: number): void {
        const calculated: Params.ICalculatedTax = this.taxes.getTaxes(amount, this.$params.mode);

        this.tax = calculated.tax;
        this.totalAmount = calculated.totalAmount;

        this.cdr.markForCheck();
    }
}
