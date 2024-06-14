import {
    Component,
    Inject,
    OnInit,
    ChangeDetectionStrategy,
    Input,
    inject,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {LoyaltyLevelsService} from 'wlc-engine/modules/loyalty';

import * as Params from './loyalty-level.params';

@Component({
    selector: '[wlc-loyalty-level]',
    templateUrl: './loyalty-level.component.html',
    styleUrls: ['./styles/loyalty-level.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyLevelComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILoyaltyLevelCParams;

    public override $params: Params.ILoyaltyLevelCParams;
    public levelTitle: string;
    public fallbackImage!: string;

    protected readonly loyaltyLevelsService: LoyaltyLevelsService = inject(LoyaltyLevelsService);

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyLevelCParams,
        configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.$params.titleAs) {
            this.levelTitle = this.$params.name;
        }

        this.fallbackImage = this.loyaltyLevelsService.getLevelIconFallback();
    }

    public get isCompactThemeMod(): boolean {
        return this.$params.themeMod === 'compact';
    }
}
