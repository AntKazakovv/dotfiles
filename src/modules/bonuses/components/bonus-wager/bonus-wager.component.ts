import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';

import {
    AbstractComponent,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services/bonuses/bonuses.service';

import * as Params from './bonus-wager.params';

@Component({
    selector: '[wlc-bonus-wager]',
    templateUrl: './bonus-wager.component.html',
    styleUrls: ['./styles/bonus-wager.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BonusWagerComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IBonusWagerCParams;
    @Input() protected bonus: Bonus;

    public override $params: Params.IBonusWagerCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBonusWagerCParams,
        protected bonusesService: BonusesService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    /** Current wager sum */
    public get wagering(): number {
        return this.bonus?.wagering || 0;
    }

    /** Total (target) wager sum */
    public get wageringTotal(): number {
        return this.bonus.wageringTotal;
    }

    public get currency(): string {
        return this.bonusesService.profile.originalCurrency;
    }

    public get progressPercent(): string {
        return `${this.bonus.getProgress()}%`;
    }
}
