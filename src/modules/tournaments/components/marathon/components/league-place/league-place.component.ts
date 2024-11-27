import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
    Input,
} from '@angular/core';
import {
    AbstractComponent,
} from 'wlc-engine/modules/core';
import {League} from 'wlc-engine/modules/tournaments/system/models/league.model';

import * as Params from './league-place.params';

@Component({
    selector: '[wlc-league-place]',
    templateUrl: './league-place.component.html',
    styleUrls: ['./styles/league-place.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaguePlaceComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILeaguePlaceCParams;

    public override $params: Params.ILeaguePlaceCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILeaguePlaceCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public get league(): League {
        return this.$params.league;
    }

    public get leagueName(): string {
        return this.league.name;
    }

    public get place(): number {
        return this.$params.place;
    }
}
