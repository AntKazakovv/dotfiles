import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
} from 'wlc-engine/modules/core';
import {LoyaltyLevelsService} from 'wlc-engine/modules/loyalty';

import * as Params from './level-number.params';

@Component({
    selector: '[wlc-level-number]',
    templateUrl: './level-number.component.html',
    styleUrls: ['./styles/level-number.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelNumberComponent extends AbstractComponent implements OnInit {
    public override $params: Params.ILevelNumberParams;
    public levelImage: string;
    public levelFallbackImage: string;

    constructor(
        @Inject('injectParams') protected params: Params.ILevelNumberParams,
        protected loyaltyLevelsService: LoyaltyLevelsService,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super(<IMixedParams<Params.ILevelNumberParams>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.levelImage = this.$params.item?.image ||
            this.loyaltyLevelsService.getLevelIcon(this.$params.item?.level);
        this.levelFallbackImage = this.loyaltyLevelsService.getLevelIconFallback();
    }
}
