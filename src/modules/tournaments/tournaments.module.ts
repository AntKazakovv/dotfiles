import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from '../core/core.module';
import {UserModule} from '../user/user.module';
import {TournamentsService} from './system/services';
import {TournamentListComponent} from './components/tournament-list/tournament-list.component';
import {TournamentThumbComponent} from './components/tournament-thumb/tournament-thumb.component';

export const components = {
    'wlc-tournament-list': TournamentListComponent,
    'wlc-tournament-thumb': TournamentThumbComponent,
};

@NgModule({
    declarations: [
        TournamentListComponent,
        TournamentThumbComponent,
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
