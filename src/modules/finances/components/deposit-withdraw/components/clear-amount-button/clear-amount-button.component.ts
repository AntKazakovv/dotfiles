import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
    ChangeDetectorRef,
    HostBinding,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
    EventService,
} from 'wlc-engine/modules/core';

import * as Params from './clear-amount-button.params';
@Component({
    selector: '[wlc-clear-amount-button]',
    templateUrl: './clear-amount-button.component.html',
    styleUrls: ['./styles/clear-amount-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClearAmountButtonComponent extends AbstractComponent implements OnInit {
    @HostBinding('class.hidden') public get hidden(): boolean {
        return this.$params.isAmountEmpty;
    }

    public override $params: Params.IClearAmountButtonCParams;
    public isAmountEmpty: boolean = true;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IClearAmountButtonCParams,
        protected eventService: EventService,
        protected override cdr: ChangeDetectorRef,
    ) {
        super(<IMixedParams<Params.IClearAmountButtonCParams>>{
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.initSubscribers();
    }

    public clearAmount(): void {
        this.eventService.emit({
            name: 'CLEAR_AMOUNT',
        });
    }

    protected initSubscribers(): void {
        this.eventService.subscribe(
            {name: 'AMOUNT_NOT_EMPTY'},
            () => {
                this.$params.isAmountEmpty = false;
                this.cdr.markForCheck();
            }, this.$destroy);

        this.eventService.subscribe(
            {name: 'AMOUNT_IS_EMPTY'},
            () => {
                this.$params.isAmountEmpty = true;
                this.cdr.markForCheck();
            }, this.$destroy);
    }
}
