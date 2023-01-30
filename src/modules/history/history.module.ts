import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {BonusesHistoryComponent} from 'wlc-engine/modules/history/components/bonuses-history/bonuses-history.component';
import {HistoryService} from 'wlc-engine/modules/history/system/services/history.service';
import {TournamentsHistoryComponent} from './components/tournaments-history/tournaments-history.component';
import {
    TournamentTopwinsBtnComponent,
} from './components/tournaments-history/components/tournament-topwins-btn/tournament-topwins-btn.component';

export const components = {
    'wlc-bonuses-history': BonusesHistoryComponent,
    'wlc-tournaments-history': TournamentsHistoryComponent,
};

export const services = {
    'history-service': HistoryService,
};

@NgModule({
    declarations: [
        BonusesHistoryComponent,
        TournamentsHistoryComponent,
        TournamentTopwinsBtnComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        TranslateModule,
    ],
    providers: [
        HistoryService,
    ],
    exports: [
        BonusesHistoryComponent,
        TournamentsHistoryComponent,
    ],
})

export class HistoryModule {
}
