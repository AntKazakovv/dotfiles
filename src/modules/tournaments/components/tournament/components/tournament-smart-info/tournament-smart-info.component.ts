import {
    Component,
    ChangeDetectionStrategy,
    Input,
    OnInit,
    ChangeDetectorRef,
    Inject,
} from '@angular/core';
import {AbstractComponent, ConfigService, GlobalHelper, IMixedParams} from 'wlc-engine/modules/core';

import {Tournament} from 'wlc-engine/modules/tournaments';

import * as Params from './tournament-smart-info.params';

@Component({
    selector: '[wlc-tournament-smart-info]',
    templateUrl: './tournament-smart-info.component.html',
    styleUrls: ['./styles/tournament-smart-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentSmartInfoComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.ITournamentSmartInfoCParams;
    @Input() public type: Params.ComponentType;
    @Input() public theme: Params.ComponentTheme;
    @Input() public themeMod: Params.ThemeMod;
    @Input() public customMod: Params.CustomMod;
    @Input() public tournament: Tournament;
    @Input() public prizePoolText: string;
    @Input() public timerTextBeforeStart: string;
    @Input() public timerTextAfterStart: string;

    public $params: Params.ITournamentSmartInfoCParams;

    constructor(
        @Inject('injectParams') protected params: Params.ITournamentSmartInfoCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.ITournamentSmartInfoCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }
    public ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this,
            ['tournament', 'type', 'theme', 'themeMod', 'customMod', 'prizePoolText', 'timerTextBeforeStart', 'timerTextAfterStart']));
    }
}
