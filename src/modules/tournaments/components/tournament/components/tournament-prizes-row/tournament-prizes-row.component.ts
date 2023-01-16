import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    HostBinding,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    CurrenciesInfo,
} from 'wlc-engine/modules/core';
import {ITournamentPrize} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';

import * as Params from './tournament-prizes-row.params';

@Component({
    selector: '[wlc-tournament-prizes-row]',
    templateUrl: './tournament-prizes-row.component.html',
    styleUrls: ['./styles/tournament-prizes-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TournamentPrizesRowComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ITournamentPrizesRowCParams;
    @Input() public prizes: ITournamentPrize[] = [];

    @HostBinding('class') get sizeModifier() {
        return this.prizes.length < 4 ? 'size-lg' : 'size-default';
    }

    public $params: Params.ITournamentPrizesRowCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITournamentPrizesRowCParams,
        protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public getDigitsInfo(currency: string): string {
        if (this.$params.useSmartDemicals) {
            return CurrenciesInfo.specialCurrencies.has(currency) ? '1-0-0': '1-2-2';
        } else {
            return '1-0-0';
        }
    }
}
