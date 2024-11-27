import {NgModule} from '@angular/core';

import _get from 'lodash-es/get';

import {CoreModule} from '../core/core.module';
import {
    TournamentsService,
    ITournamentsModule,
    MarathonBannerComponent,
} from 'wlc-engine/modules/tournaments';

import {
    TournamentDetailComponent,
} from './components/tournament/components/tournament-detail/tournament-detail.component';
import {TournamentListComponent} from './components/tournament-list/tournament-list.component';
import {
    TournamentComponent,
} from './components/tournament/tournament.component';
import {
    MarathonComponent,
} from './components/marathon/marathon.component';
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
import {
    LeagueStatusComponent,
    LeagueInfoComponent,
} from 'wlc-engine/modules/tournaments/components';
import {CompilerModule} from 'wlc-engine/modules/compiler';
import {GlobalHelper} from 'wlc-engine/modules/core';
import {tournamentsConfig} from './system/config/tournaments.config';
import * as $config from 'wlc-config/index';

import {TournamentFreeSpinsComponent} from
    './components/tournament/components/tournament-free-spins/tournament-free-spins.component';
import {
    LeaguePlaceComponent,
} from 'wlc-engine/modules/tournaments/components/marathon/components/league-place/league-place.component';

export const moduleConfig =
    GlobalHelper.mergeConfig<ITournamentsModule>(tournamentsConfig, _get($config, '$tournaments', {}));

export const components = {
    'wlc-tournament-list': TournamentListComponent,
    'wlc-tournament-leaderboard': TournamentLeaderboardComponent,
    'wlc-tournament': TournamentComponent,
    'wlc-marathon': MarathonComponent,
    'wlc-marathon-banner': MarathonBannerComponent,
    'wlc-league-status': LeagueStatusComponent,
    'wlc-league-info': LeagueInfoComponent,
    'wlc-league-place': LeaguePlaceComponent,
};

export const services = {
    'tournaments-service': TournamentsService,
};

@NgModule({
    declarations: [
        TournamentDetailComponent,
        TournamentListComponent,
        TournamentComponent,
        MarathonComponent,
        MarathonBannerComponent,
        LeagueStatusComponent,
        LeagueInfoComponent,
        LeaguePlaceComponent,
        TournamentLeaderboardComponent,
        TournamentPromoComponent,
        TournamentPrizesComponent,
        TournamentConditionComponent,
        TournamentBannerComponent,
        TournamentSmartInfoComponent,
        TournamentPrizesRowComponent,
        TournamentFreeSpinsComponent,
    ],
    imports: [
        CoreModule,
        CompilerModule,
    ],
    providers: [
        TournamentsService,
    ],
    exports: [
        TournamentListComponent,
        TournamentComponent,
        MarathonComponent,
        MarathonBannerComponent,
        LeagueStatusComponent,
        LeagueInfoComponent,
        LeaguePlaceComponent,
        TournamentLeaderboardComponent,
    ],
})

export class TournamentsModule {
}
