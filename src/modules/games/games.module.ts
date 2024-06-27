import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {UIRouterModule} from '@uirouter/angular';
import {CountUpModule} from 'ngx-countup';

import _get from 'lodash-es/get';

// Modules
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {CompilerModule} from 'wlc-engine/modules/compiler';
import {GlobalHelper} from 'wlc-engine/modules/core';

// System
import {GamesCatalogService} from './system/services/games-catalog/games-catalog.service';
import {MerchantFieldsService} from './system/services/merchant-fields/merchant-fields.service';
import {MerchantWalletService} from './system/services/merchant-wallet/merchant-wallet.service';
import {IGamesConfig} from './system/interfaces/games.interfaces';
import {gamesConfig} from './system/config/games.config';

// Components
import {GamesGridComponent} from './components/games-grid/games-grid.component';
import {GameThumbComponent} from './components/game-thumb/game-thumb.component';
import {GameWrapperComponent} from './components/game-wrapper/game-wrapper.component';
import {RecommendedGamesComponent} from './components/recommended-games/recommended-games.component';
import {SearchFieldComponent} from './components/search-field/search-field.component';
import {SearchComponent} from './components/search/search.component';
import {SearchV2Component} from './components/search-v2/search-v2.component';
import {DropdownSearchComponent} from './components/dropdown-search/dropdown-search.component';
import {TotalJackpotComponent} from './components/total-jackpot/total-jackpot.component';
import {PlayGameForRealComponent} from './components/play-game-for-real/play-game-for-real.component';
import {GameDashboardComponent} from './components/game-dashboard/game-dashboard.component';
import {RandomGameComponent} from './components/random-game/random-game.component';
import {
    CategoryPreviewComponent,
} from './components/category-preview/category-preview.component';
import {ProgressBarComponent} from './components/progress-bar/progress-bar.component';
import {GamesCatalogComponent} from './components/games-catalog/games-catalog.component';
import {
    MerchantWalletPreviewComponent,
    MerchantWalletInfoComponent,
    MerchantWalletFormComponent,
    MerchantWalletExrateComponent,
} from './components/merchant-wallet';
import {LuckyButtonComponent} from './components/lucky-button/lucky-button.component';
import {FavouriteButtonComponent} from './components/favourite-button/favourite-button.component';
import {HouseGamesComponent} from './components/house-games/house-games.component';

import {SearchMerchantListComponent} from 'wlc-engine/modules/games/components/search-v2';
import {SearchCategoriesListComponent} from 'wlc-engine/modules/games/components/search-v2';
import {SearchControlComponent} from 'wlc-engine/modules/games/components/search-v2';
import {SearchControlEasyComponent} from 'wlc-engine/modules/games/components/search-v2';
import {SearchLastQueriesComponent} from 'wlc-engine/modules/games/components/search-v2';
import {SearchResultComponent} from 'wlc-engine/modules/games/components/search-v2';
import {SearchResultEasyComponent} from 'wlc-engine/modules/games/components/search-v2';
import {SearchDefaultComponent} from 'wlc-engine/modules/games/components/search-v2';
import {SearchEasyComponent} from 'wlc-engine/modules/games/components/search-v2';

import * as $config from 'wlc-config/index';

import {GamesSliderComponent} from './components/games-slider/games-slider.component';
import {GamesFilterService} from 'wlc-engine/modules/games/system/services/games-filter.service';

export const moduleConfig =
    GlobalHelper.mergeConfig<IGamesConfig>(gamesConfig, _get($config, '$games', {}));

export const components = {
    'wlc-category-preview': CategoryPreviewComponent,
    'wlc-game-dashboard': GameDashboardComponent,
    'wlc-game-thumb': GameThumbComponent,
    'wlc-game-wrapper': GameWrapperComponent,
    'wlc-games-catalog': GamesCatalogComponent,
    'wlc-games-grid': GamesGridComponent,
    'wlc-recommended-games': RecommendedGamesComponent,
    'wlc-merchant-wallet-exrate': MerchantWalletExrateComponent,
    'wlc-merchant-wallet-form': MerchantWalletFormComponent,
    'wlc-merchant-wallet-info': MerchantWalletInfoComponent,
    'wlc-merchant-wallet-preview': MerchantWalletPreviewComponent,
    'wlc-games-slider': GamesSliderComponent,
    'wlc-play-game-for-real': PlayGameForRealComponent,
    'wlc-random-game': RandomGameComponent,
    'wlc-search': moduleConfig.search?.useOldSearch ? SearchComponent : SearchV2Component,
    'wlc-search-field': SearchFieldComponent,
    'wlc-dropdown-search': DropdownSearchComponent,
    'wlc-total-jackpot': TotalJackpotComponent,
    'wlc-lucky-button': LuckyButtonComponent,
    'wlc-favourite-button': FavouriteButtonComponent,
    'wlc-house-games': HouseGamesComponent,
};

export const services = {
    'games-catalog-service': GamesCatalogService,
    'games-filter-service': GamesFilterService,
    'merchant-wallet-service': MerchantWalletService,
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
        GamesSliderComponent,
        RecommendedGamesComponent,
        PlayGameForRealComponent,
        RandomGameComponent,
        SearchFieldComponent,
        SearchComponent,
        DropdownSearchComponent,
        TotalJackpotComponent,
        ProgressBarComponent,
        MerchantWalletExrateComponent,
        MerchantWalletFormComponent,
        MerchantWalletInfoComponent,
        MerchantWalletPreviewComponent,
        LuckyButtonComponent,
        FavouriteButtonComponent,
        HouseGamesComponent,
        SearchV2Component,
        SearchMerchantListComponent,
        SearchCategoriesListComponent,
        SearchControlComponent,
        SearchControlEasyComponent,
        SearchLastQueriesComponent,
        SearchResultComponent,
        SearchResultEasyComponent,
        SearchDefaultComponent,
        SearchEasyComponent,
    ],
    id: 'GamesModule',
    imports: [
        UIRouterModule,
        FormsModule,
        CountUpModule,
        CoreModule,
        CompilerModule,
    ],
    providers: [
        GamesCatalogService,
        GamesFilterService,
        MerchantFieldsService,
        MerchantWalletService,
    ],
    exports: [
        GamesGridComponent,
        RecommendedGamesComponent,
        GameWrapperComponent,
        GameThumbComponent,
        SearchFieldComponent,
        SearchComponent,
        DropdownSearchComponent,
        TotalJackpotComponent,
        GamesSliderComponent,
        PlayGameForRealComponent,
        GameDashboardComponent,
        RandomGameComponent,
        CategoryPreviewComponent,
        ProgressBarComponent,
        MerchantWalletExrateComponent,
        MerchantWalletFormComponent,
        MerchantWalletInfoComponent,
        MerchantWalletPreviewComponent,
        LuckyButtonComponent,
        HouseGamesComponent,
    ],
})
export class GamesModule {
}
