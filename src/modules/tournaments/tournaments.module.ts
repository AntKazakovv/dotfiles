import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from '../core/core.module';
import {UserModule} from 'wlc-engine/modules/user/user.module';
import {TournamentsService} from 'wlc-engine/modules/tournaments';
import {MenuModule} from 'wlc-engine/modules/menu/menu.module';
import {GamesModule} from 'wlc-engine/modules/games/games.module';

import {TournamentDetailComponent} from './components/tournament-detail/tournament-detail.component';
import {PromoModule} from '../promo/promo.module';
import {TournamentListComponent} from './components/tournament-list/tournament-list.component';
import {TournamentComponent} from './components/tournament/tournament.component';
import {TournamentLeaderboardComponent} from './components/tournament/components/tournament-leaderboard/tournament-leaderboard.component';

export const components = {
    'wlc-tournament-detail': TournamentDetailComponent,
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
    ],
    imports: [
        CommonModule,
        CoreModule,
        UserModule,
        PromoModule,
        TranslateModule,
        UserModule,
        MenuModule,
        GamesModule,
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
