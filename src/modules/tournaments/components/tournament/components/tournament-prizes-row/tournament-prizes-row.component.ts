import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    HostBinding,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core';
import {CurrenciesInfo} from 'wlc-engine/modules/core/constants';
import {ITournamentPrize} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';

import * as Params from './tournament-prizes-row.params';

@Component({
    selector: '[wlc-tournament-prizes-row]',
    templateUrl: './tournament-prizes-row.component.html',
    styleUrls: ['./styles/tournament-prizes-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TournamentPrizesRowComponent extends AbstractComponent implements OnInit {
    @Input() public prizes: ITournamentPrize[] = [];
    @Input() protected inlineParams: Params.ITournamentPrizesRowCParams;

    public mainCurrency: ITournamentPrize[] = [];
    public restCurrency: ITournamentPrize[] = [];

    @HostBinding('class') get sizeModifier(): string {
        return this.prizes.length < 4 ? 'size-lg' : 'size-default';
    }

    public override $params: Params.ITournamentPrizesRowCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITournamentPrizesRowCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
        if ('history' in this.injectParams) this.prizes = this.injectParams.wins;
    }

    public get isTornamentHistory(): boolean {
        return 'history' in this.injectParams || this.inlineParams?.type === 'history';
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.$params.themeMod === 'short-line' && this.prizes.length > 2) {
            this.prizes.forEach((prize, i) => {
                if (i === 0) {
                    this.mainCurrency.push(prize);
                } else {
                    this.restCurrency.push(prize);
                }
            });
        } else {
            this.mainCurrency = this.prizes;
        }
    }

    public getDigitsInfo(currency: string): string {
        if (this.$params.useSmartDemicals) {
            return CurrenciesInfo.specialCurrencies.has(currency) ? '1-0-0' : '1-2-2';
        } else {
            return '1-0-0';
        }
    }
}
