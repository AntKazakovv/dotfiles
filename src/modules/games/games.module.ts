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
import {CoreModule} from '../core/core.module';
import {SearchFieldComponent} from './components/search-field/search-field.component';
import {SearchComponent} from './components/search/search.component';
import {TotalJackpotComponent} from 'wlc-engine/modules/games/components/total-jackpot/total-jackpot.component';
import {CountUpModule} from 'ngx-countup';
import {PlayGameForRealComponent} from './components/play-game-for-real/play-game-for-real.component';
import {GameDashboardComponent} from 'wlc-engine/modules/games/components/game-dashboard/game-dashboard.component';
import {IIndexing, GlobalHelper} from 'wlc-engine/modules/core';

import {IGamesConfig} from './system/interfaces/games.interfaces';
import {gamesConfig} from './system/config/games.config';
import * as $config from 'wlc-config/index';

import {
    get as _get,
} from 'lodash';

export const moduleConfig =
    GlobalHelper.mergeConfig<IGamesConfig>(gamesConfig, _get($config, '$games', {}));


export const components = {
    'wlc-games-grid': GamesGridComponent,
    'wlc-game-thumb': GameThumbComponent,
    'wlc-game-wrapper': GameWrapperComponent,
    'wlc-search-field': SearchFieldComponent,
    'wlc-total-jackpot': TotalJackpotComponent,
    'wlc-play-game-for-real': PlayGameForRealComponent,
    'wlc-game-dashboard': GameDashboardComponent,
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
    ],
    id: 'GamesModule',
    imports: [
        CommonModule,
        CoreModule,
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
    ],
})
export class GamesModule {
}
