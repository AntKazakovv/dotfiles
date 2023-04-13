import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core';

import {IBonusesListCParams} from 'wlc-engine/modules/bonuses/components/bonuses-list/bonuses-list.params';

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

    public override $params: Params.ICRecommendedBonusesParams;
    public activeBonusesParams: IBonusesListCParams = null;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICRecommendedBonusesParams,
        cdr: ChangeDetectorRef,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, null, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.activeBonusesParams = {
            theme: 'active',
            common: {
                filter: this.$params.common.filter,
                restType: this.$params.common.restType,
                useNoDataText: this.$params.useNoDataText,
                useQuery: this.$params.common.useQuery,
                pagination: this.$params.common.pagination,
            },
            itemsParams: this.$params.itemsParams,
        };
    }
}
