import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {TranslateModule} from '@ngx-translate/core';
import {AngularResizedEventModule} from 'angular-resize-event';
import {GamesCatalogService} from './system/services/games-catalog/games-catalog.service';
import {MerchantFieldsService} from './system/services/merchant-fields/merchant-fields.service';
import {FormsModule} from '@angular/forms';
import {GamesGridComponent} from './components/games-grid/games-grid.component';
import {GameThumbComponent} from './components/game-thumb/game-thumb.component';
import {GameWrapperComponent} from './components/game-wrapper/game-wrapper.component';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {UserModule} from 'wlc-engine/modules/user/user.module';
import {PromoModule} from 'wlc-engine/modules/promo/promo.module';
import {SearchFieldComponent} from './components/search-field/search-field.component';
import {SearchComponent} from './components/search/search.component';
import {TotalJackpotComponent} from 'wlc-engine/modules/games/components/total-jackpot/total-jackpot.component';
import {CountUpModule} from 'ngx-countup';
import {PlayGameForRealComponent} from './components/play-game-for-real/play-game-for-real.component';
import {GameDashboardComponent} from './components/game-dashboard/game-dashboard.component';
import {RandomGameComponent} from  'wlc-engine/modules/games/components/random-game/random-game.component';
import {
    CategoryPreviewComponent,
} from 'wlc-engine/modules/games/components/category-preview/category-preview.component';
import {ProviderLinksComponent} from './components/provider-links/provider-links.component';
import {ProviderGamesComponent} from './components/provider-games/provider-games.component';
import {ProgressBarComponent} from './components/progress-bar/progress-bar.component';
import {GamesCatalogComponent} from './components/games-catalog/games-catalog.component';
import {CompilerModule} from 'wlc-engine/modules/compiler';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {IGamesConfig} from './system/interfaces/games.interfaces';
import {gamesConfig} from './system/config/games.config';
import * as $config from 'wlc-config/index';

import _get from 'lodash-es/get';

export const moduleConfig =
    GlobalHelper.mergeConfig<IGamesConfig>(gamesConfig, _get($config, '$games', {}));

export const components = {
    'wlc-category-preview': CategoryPreviewComponent,
    'wlc-game-dashboard': GameDashboardComponent,
    'wlc-game-thumb': GameThumbComponent,
    'wlc-game-wrapper': GameWrapperComponent,
    'wlc-games-catalog': GamesCatalogComponent,
    'wlc-games-grid': GamesGridComponent,
    'wlc-play-game-for-real': PlayGameForRealComponent,
    'wlc-random-game': RandomGameComponent,
    'wlc-search': SearchComponent,
    'wlc-search-field': SearchFieldComponent,
    'wlc-total-jackpot': TotalJackpotComponent,
    'wlc-provider-links': ProviderLinksComponent,
    'wlc-provider-games': ProviderGamesComponent,
};

export const services = {
    'games-catalog-service': GamesCatalogService,
    'merchant-fields-service': MerchantFieldsService,
};

@NgModule({
    declarations: [
        CategoryPreviewComponent,
        GameDashboardComponent,
        GameThumbComponent,
        GameWrapperComponent,
        GamesCatalogComponent,
        GamesGridComponent,
        PlayGameForRealComponent,
        RandomGameComponent,
        SearchFieldComponent,
        SearchComponent,
        TotalJackpotComponent,
        ProviderLinksComponent,
        ProviderGamesComponent,
        ProgressBarComponent,
    ],
    id: 'GamesModule',
    imports: [
        CommonModule,
        UIRouterModule,
        TranslateModule,
        AngularResizedEventModule,
        FormsModule,
        CountUpModule,
        CoreModule,
        UserModule,
        PromoModule,
        CompilerModule,
    ],
    providers: [
        GamesCatalogService,
        MerchantFieldsService,
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
        ProviderLinksComponent,
        ProviderGamesComponent,
    ],
})
export class GamesModule {
}
