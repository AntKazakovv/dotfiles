import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from '../core/core.module';
import {UserModule} from 'wlc-engine/modules/user/user.module';
import {TournamentsService} from 'wlc-engine/modules/tournaments';
import {MenuModule} from 'wlc-engine/modules/menu/menu.module';

import {TournamentDetailComponent} from './components/tournament/components/tournament-detail/tournament-detail.component';
import {PromoModule} from '../promo/promo.module';
import {TournamentListComponent} from './components/tournament-list/tournament-list.component';
import {TournamentComponent} from './components/tournament/tournament.component';
import {TournamentLeaderboardComponent} from './components/tournament/components/tournament-leaderboard/tournament-leaderboard.component';
import {TournamentPromoComponent} from './components/tournament/components/tournament-promo/tournament-promo.component';
import {TournamentPrizesComponent} from './components/tournament/components/tournament-prizes/tournament-prizes.component';
import {TournamentConditionComponent} from './components/tournament/components/tournament-condition/tournament-condition.component';
import {TournamentBannerComponent} from './components/tournament/components/tournament-banner/tournament-banner.component';
import {TournamentsHistoryComponent} from './components/tournaments-history/tournaments-history.component';

export const components = {
    'wlc-tournament-list': TournamentListComponent,
    'wlc-tournament-leaderboard': TournamentLeaderboardComponent,
    'wlc-tournament': TournamentComponent,
    'wlc-tournaments-history': TournamentsHistoryComponent,
};

@NgModule({
    declarations: [
        TournamentsHistoryComponent,
        TournamentDetailComponent,
        TournamentListComponent,
        TournamentComponent,
        TournamentLeaderboardComponent,
        TournamentPromoComponent,
        TournamentPrizesComponent,
        TournamentConditionComponent,
        TournamentBannerComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        UserModule,
        PromoModule,
        TranslateModule,
        MenuModule,
    ],
    providers: [
        TournamentsService,
    ],
    exports: [
        TournamentListComponent,
        TournamentComponent,
        TournamentLeaderboardComponent,
        TournamentsHistoryComponent,
    ],
})

export class TournamentsModule {
}
