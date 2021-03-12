import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from '../core/core.module';
import {UserModule} from '../user/user.module';
import {TournamentsService} from './system/services';
import {TournamentListComponent} from './components/tournament-list/tournament-list.component';
import {TournamentComponent} from './components/tournament/tournament.component';

export const components = {
    'wlc-tournament-list': TournamentListComponent,
    'wlc-tournament': TournamentComponent,
};

@NgModule({
    declarations: [
        TournamentListComponent,
        TournamentComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        UserModule,
        TranslateModule,
    ],
    providers: [
        TournamentsService,
    ],
    exports: [],
})

export class TournamentsModule {
}
