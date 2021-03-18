import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {TranslateModule} from '@ngx-translate/core';
import {AngularResizedEventModule} from 'angular-resize-event';
import {GamesCatalogService} from './system/services';
import {FormsModule} from '@angular/forms';
import {CategoriesService} from 'wlc-engine/modules/games';
import {GamesGridComponent} from './components/games-grid/games-grid.component';
import {GameThumbComponent} from './components/game-thumb/game-thumb.component';
import {GameWrapperComponent} from './components/game-wrapper/game-wrapper.component';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {UserModule} from 'wlc-engine/modules/user/user.module';
import {BonusesModule} from 'wlc-engine/modules/bonuses/bonuses.module';
import {TournamentsModule} from 'wlc-engine/modules/tournaments/tournaments.module';
import {PromoModule} from 'wlc-engine/modules/promo/promo.module';
import {SearchFieldComponent} from './components/search-field/search-field.component';
import {SearchComponent} from './components/search/search.component';
import {TotalJackpotComponent} from 'wlc-engine/modules/games/components/total-jackpot/total-jackpot.component';
import {CountUpModule} from 'ngx-countup';
import {PlayGameForRealComponent} from './components/play-game-for-real/play-game-for-real.component';
import {GameDashboardComponent} from './components/game-dashboard/game-dashboard.component';
import {GameDashboardBonusesComponent} from './components/game-dashboard-bonuses/game-dashboard-bonuses.component';
import {RandomGameComponent} from  'wlc-engine/modules/games/components/random-game/random-game.component';
import {CategoryPreviewComponent} from 'wlc-engine/modules/games/components/category-preview/category-preview.component';
import {IIndexing, GlobalHelper} from 'wlc-engine/modules/core';

import {IGamesConfig} from './system/interfaces/games.interfaces';
import {gamesConfig} from './system/config/games.config';
import * as $config from 'wlc-config/index';

import {
    get as _get,
} from 'lodash-es';


export const moduleConfig =
    GlobalHelper.mergeConfig<IGamesConfig>(gamesConfig, _get($config, '$games', {}));

export const components = {
    'wlc-category-preview': CategoryPreviewComponent,
    'wlc-game-dashboard': GameDashboardComponent,
    'wlc-game-thumb': GameThumbComponent,
    'wlc-game-wrapper': GameWrapperComponent,
    'wlc-games-grid': GamesGridComponent,
    'wlc-play-game-for-real': PlayGameForRealComponent,
    'wlc-random-game': RandomGameComponent,
    'wlc-search-field': SearchFieldComponent,
    'wlc-total-jackpot': TotalJackpotComponent,
};

@NgModule({
    declarations: [
        GamesGridComponent,
        GameThumbComponent,
        GameWrapperComponent,
        SearchFieldComponent,
        SearchComponent,
        TotalJackpotComponent,
        PlayGameForRealComponent,
        GameDashboardComponent,
        GameDashboardBonusesComponent,
        RandomGameComponent,
        CategoryPreviewComponent,
    ],
    id: 'GamesModule',
    imports: [
        CommonModule,
        CoreModule,
        UserModule,
        BonusesModule,
        TournamentsModule,
        PromoModule,
        UIRouterModule,
        TranslateModule,
        AngularResizedEventModule,
        FormsModule,
        CountUpModule,
    ],
    providers: [
        GamesCatalogService,
        CategoriesService,
    ],
    exports: [
        GamesGridComponent,
        GameWrapperComponent,
        SearchFieldComponent,
        SearchComponent,
        TotalJackpotComponent,
        PlayGameForRealComponent,
        GameDashboardComponent,
        RandomGameComponent,
        CategoryPreviewComponent,
    ],
})
export class GamesModule {
}
