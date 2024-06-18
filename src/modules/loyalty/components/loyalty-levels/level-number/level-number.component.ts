import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
    Input,
    inject,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core';
import {LoyaltyLevelsService} from 'wlc-engine/modules/loyalty/system/services/loyalty-levels/loyalty-levels.service';

import * as Params from './level-number.params';

@Component({
    selector: '[wlc-level-number]',
    templateUrl: './level-number.component.html',
    styleUrls: ['./styles/level-number.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelNumberComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILevelNumberCParams;

    public override $params: Params.ILevelNumberCParams;
    public levelImage!: string;
    public levelFallbackImage!: string;

    protected readonly loyaltyLevelsService: LoyaltyLevelsService = inject(LoyaltyLevelsService);

    constructor(
        @Inject('injectParams') protected params: Params.ILevelNumberCParams,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.levelImage = this.$params.item?.image ||
            this.loyaltyLevelsService.getLevelIcon(this.$params.item?.level);
        this.levelFallbackImage = this.loyaltyLevelsService.getLevelIconFallback();
    }
}
