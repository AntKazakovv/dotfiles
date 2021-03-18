import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from '../core/core.module';
import {UserModule} from '../user/user.module';
import {PromoModule} from '../promo/promo.module';
import {TournamentsService} from './system/services';
import {TournamentListComponent} from './components/tournament-list/tournament-list.component';
import {TournamentComponent} from './components/tournament/tournament.component';
import {TournamentLeaderboardComponent} from './components/tournament/components/tournament-leaderboard/tournament-leaderboard.component';

export const components = {
    'wlc-tournament-list': TournamentListComponent,
    'wlc-tournament': TournamentComponent,
    'wlc-tournament-leaderboard': TournamentLeaderboardComponent,
};

@NgModule({
    declarations: [
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
