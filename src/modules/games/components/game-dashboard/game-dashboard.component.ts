import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ActionService, ConfigService} from 'wlc-engine/modules/core';
import * as Params from './game-dashboard.params';

import {
    takeUntil,
} from 'rxjs/operators';

import {
    assign as _assign,
    clone as _clone,
} from 'lodash';

@Component({
  selector: '[wlc-game-dashboard]',
  templateUrl: './game-dashboard.component.html',
  styleUrls: ['./styles/game-dashboard.component.scss']
})
export class GameDashboardComponent extends AbstractComponent implements OnInit {

    public $params: Params.IGameDashboardCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IGameDashboardCParams,
        protected cdr: ChangeDetectorRef,
        protected actionService: ActionService,
        protected configService: ConfigService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

}
