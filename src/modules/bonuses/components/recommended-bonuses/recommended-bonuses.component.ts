import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {takeUntil} from 'rxjs/internal/operators';

import {
    AbstractComponent,
    EventService,
    IEvent,
} from 'wlc-engine/modules/core';

import {IBonusesListCParams} from 'wlc-engine/modules/bonuses';

import * as Params from './recommended-bonuses.params';

@Component({
    selector: '[wlc-recommended-bonuses]',
    templateUrl: './recommended-bonuses.component.html',
    styleUrls: ['./styles/recommended-bonuses.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendedBonusesComponent
    extends AbstractComponent
    implements OnInit {

    public $params: Params.ICRecommendedBonusesParams;
    public activeBonusesParams: IBonusesListCParams = null;
    public numberOfActiveBonuses: number;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICRecommendedBonusesParams,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.activeBonusesParams = {
            theme: 'active',
            common: {
                filter: this.$params.common.filter,
                restType: this.$params.common.restType,
                useNoDataText: this.$params.useNoDataText,
                useQuery: this.$params.common.useQuery,
            },
            itemsParams: this.$params.itemsParams,
        };


        this.eventService.filter([{
            name: Params.RecommendedListEvents.RecommendedListVisibility,
        }])
            .pipe(takeUntil(this.$destroy))
            .subscribe(({data}: IEvent<number>) => {
                this.numberOfActiveBonuses = data;
                this.cdr.markForCheck();
            });
    }
}
