import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from '../core/core.module';
import {
    TournamentsService,
    ITournamentsModule,
} from 'wlc-engine/modules/tournaments';

import {
    TournamentDetailComponent,
} from './components/tournament/components/tournament-detail/tournament-detail.component';
import {TournamentListComponent} from './components/tournament-list/tournament-list.component';
import {
    TournamentComponent,
} from './components/tournament/tournament.component';
import {
    TournamentLeaderboardComponent,
} from './components/tournament/components/tournament-leaderboard/tournament-leaderboard.component';
import {TournamentPromoComponent} from './components/tournament/components/tournament-promo/tournament-promo.component';
import {
    TournamentPrizesComponent,
} from './components/tournament/components/tournament-prizes/tournament-prizes.component';
import {
    TournamentConditionComponent,
} from './components/tournament/components/tournament-condition/tournament-condition.component';
import {
    TournamentBannerComponent,
} from './components/tournament/components/tournament-banner/tournament-banner.component';
import {
    TournamentSmartInfoComponent,
} from './components/tournament/components/tournament-smart-info/tournament-smart-info.component';
import {
    TournamentPrizesRowComponent,
} from './components/tournament/components/tournament-prizes-row/tournament-prizes-row.component';
import {CompilerModule} from 'wlc-engine/modules/compiler';
import {GlobalHelper} from 'wlc-engine/modules/core';
import {tournamentsConfig} from './system/config/tournaments.config';
import * as $config from 'wlc-config/index';

import _get from 'lodash-es/get';

export const moduleConfig =
    GlobalHelper.mergeConfig<ITournamentsModule>(tournamentsConfig, _get($config, '$tournaments', {}));

export const components = {
    'wlc-tournament-list': TournamentListComponent,
    'wlc-tournament-leaderboard': TournamentLeaderboardComponent,
    'wlc-tournament': TournamentComponent,
};

@NgModule({
    declarations: [
        TournamentDetailComponent,
        TournamentListComponent,
        TournamentComponent,
        TournamentLeaderboardComponent,
        TournamentPromoComponent,
        TournamentPrizesComponent,
        TournamentConditionComponent,
        TournamentBannerComponent,
        TournamentSmartInfoComponent,
        TournamentPrizesRowComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        TranslateModule,
        CompilerModule,
    ],
    providers: [
        TournamentsService,
    ],
    exports: [
        TournamentListComponent,
        TournamentComponent,
        TournamentLeaderboardComponent,
    ],
})

export class TournamentsModule {
}
