import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes';
import {DataService} from 'wlc-engine/modules/core/system/services';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {IJackpot} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import * as Params from './total-jackpot.params';

/**
 * Component displaying the latest jackpots
 *
 * @example
 *
 * {
 *     name: 'games.wlc-total-jackpot',
 * }
 *
 */
@Component({
    selector: '[wlc-total-jackpot]',
    templateUrl: './total-jackpot.component.html',
    styleUrls: ['./styles/total-jackpot.component.scss'],
})
export class TotalJackpotComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ITotalJackpotCParams;

    public $params: Params.ITotalJackpotCParams;
    public amount: number;

    constructor(
        @Inject('injectParams') protected params: Params.ITotalJackpotCParams,
        protected dataService: DataService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        // TODO: replace when there will be a service for receiving jackpots
        this.getLastJackpots();
    }

    private async getLastJackpots() {

        this.dataService.registerMethod({
            name: 'jackpots',
            system: 'jackpots',
            url: '/jackpots',
            type: 'GET',
            period: 10000,
            events: {
                success: 'JACKPOTS_SUCCESS',
                fail: 'JACKPOTS_ERROR',
            },
        });

        this.dataService.subscribe('jackpots/jackpots', (req: IData): void => {
            if (req?.data) { this.calcAmount(req.data); }
        });
    }

    private calcAmount(data: IJackpot[]): void {
        this.amount = Math.round(data.reduce((accumulator: number, currentValue: IJackpot) => (
            accumulator + currentValue.amount
        ), 0));
        this.cdr.markForCheck();
    }
}
