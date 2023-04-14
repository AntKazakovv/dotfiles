import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
    Input,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
    EventService,
} from 'wlc-engine/modules/core';

import * as Params from './preselected-amounts.params';

@Component({
    selector: '[wlc-preselected-amounts]',
    templateUrl: './preselected-amounts.component.html',
    styleUrls: ['./styles/preselected-amounts.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreselectedAmountsComponent extends AbstractComponent implements OnInit {

    @Input() protected amounts: number[];
    public currency: string;
    public override $params: Params.IPreselectedAmountsCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPreselectedAmountsCParams,
        protected eventService: EventService,
    ) {
        super(<IMixedParams<Params.IPreselectedAmountsCParams>>{
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit();
    }

    public setAmount(value: number): void {
        this.eventService.emit(
            {
                name: 'SELECT_AMOUNT',
                data: {amount: value},
            },
        );
    }
}
