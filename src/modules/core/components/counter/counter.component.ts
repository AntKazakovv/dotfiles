import {
    Component,
    OnInit,
    Input,
    ViewEncapsulation,
    ChangeDetectorRef,
    Inject,
} from '@angular/core';
import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes';
import {EventService} from '../..';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services';
import {ICounterType} from '../../system/interfaces';

import * as Params from './counter.params';

@Component({
    selector: '[wlc-counter]',
    templateUrl: './counter.component.html',
    styleUrls: ['./styles/counter.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CounterComponent extends AbstractComponent implements OnInit {
    public $params: Params.ICounterCParams;
    public count: number = 0;

    @Input() public wlcElement: string;
    @Input() protected counterType: ICounterType;

    constructor(
        @Inject('injectParams') protected params: Params.ICounterCParams,
        protected eventService: EventService,
        protected bonusesService: BonusesService,
        protected cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.ICounterCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public ngOnInit(): void {
        super.ngOnInit();
        if (this.$params?.counter) {
            this.counterType = this.$params.counter;
        }
        switch (this.counterType) {
            case ('bonuses-main' || 'bonuses-all'):
                this.bonusesService.getSubscribe({
                    useQuery: !this.bonusesService.bonuses?.length,
                    observer: {
                        next: (bonuses: Bonus[]) => {
                            if (bonuses) {
                                bonuses = this.counterType === 'bonuses-main' ?
                                    this.bonusesService.filterBonuses(bonuses, 'main'):
                                    bonuses;
                                this.count = bonuses.length;
                            }
                            this.cdr.markForCheck();
                        },
                    },
                    type: 'any',
                    until: this.$destroy,
                });
                break;
            case 'store':
                break;
            case 'tournaments':
                break;
        }
    }
}
