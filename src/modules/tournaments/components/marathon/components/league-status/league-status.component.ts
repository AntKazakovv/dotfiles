import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
    Input,
} from '@angular/core';
import {
    AbstractComponent,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {League} from 'wlc-engine/modules/tournaments/system/models/league.model';

import * as Params from './league-status.params';

@Component({
    selector: '[wlc-league-status]',
    templateUrl: './league-status.component.html',
    styleUrls: ['./styles/league-status.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeagueStatusComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILeagueStatusCParams;

    public override $params: Params.ILeagueStatusCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILeagueStatusCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public joinLeague(): void {
        this.$params.joinCallback?.();
    }

    public get league(): League {
        return this.$params.league;
    }

    public get desktopBtnParams(): IButtonCParams {
        return this.$params.desktopBtnParams;
    }

    public get successStatusMessage(): string {
        return this.$params.successStatusMessage;
    }

    public get notAvailableStatusMessage(): string {
        return this.$params.notAvailableStatusMessage;
    }
}
