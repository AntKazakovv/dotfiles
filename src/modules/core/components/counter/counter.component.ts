import {
    Component,
    OnInit,
    Input,
    ViewEncapsulation,
    ChangeDetectorRef,
    Inject,
    Injector,
} from '@angular/core';
import {
    AbstractComponent,
    IMixedParams,
    EventService,
    LayoutService,
    ConfigService,
} from 'wlc-engine/modules/core';
import {
    Bonus,
    BonusesService,
} from 'wlc-engine/modules/bonuses';
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
        protected configService: ConfigService,
        protected layoutService: LayoutService,
        protected cdr: ChangeDetectorRef,
        protected injector: Injector,
    ) {
        super(
            <IMixedParams<Params.ICounterCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        if (this.$params?.counter) {
            this.counterType = this.$params.counter;
        }
        switch (this.counterType) {
            case ('bonuses-main' || 'bonuses-all'):
                await this.configService.ready;
                await this.layoutService.importModules(['bonuses']);
                const bonusesService: BonusesService = this.injector.get(BonusesService);

                bonusesService.getSubscribe({
                    useQuery: !bonusesService.bonuses?.length,
                    observer: {
                        next: (bonuses: Bonus[]) => {
                            if (bonuses) {
                                bonuses = this.counterType === 'bonuses-main' ?
                                    bonusesService.filterBonuses(bonuses, 'main'):
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
