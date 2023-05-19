import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {UIRouterModule} from '@uirouter/angular';
import {TranslateModule} from '@ngx-translate/core';
import {CountUpModule} from 'ngx-countup';

import _get from 'lodash-es/get';

// Modules
import {IconListModule} from 'wlc-engine/modules/icon-list/icon-list.module';
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
import {SearchFieldComponent} from './components/search-field/search-field.component';
import {SearchComponent} from './components/search/search.component';
import {DropdownSearchComponent} from './components/dropdown-search/dropdown-search.component';
import {TotalJackpotComponent} from './components/total-jackpot/total-jackpot.component';
import {PlayGameForRealComponent} from './components/play-game-for-real/play-game-for-real.component';
import {GameDashboardComponent} from './components/game-dashboard/game-dashboard.component';
import {RandomGameComponent} from './components/random-game/random-game.component';
import {
    CategoryPreviewComponent,
} from './components/category-preview/category-preview.component';
import {ProviderLinksComponent} from './components/provider-links/provider-links.component';
import {ProviderGamesComponent} from './components/provider-games/provider-games.component';
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

import * as $config from 'wlc-config/index';

import {GamesSliderComponent} from './components/games-slider/games-slider.component';

export const moduleConfig =
    GlobalHelper.mergeConfig<IGamesConfig>(gamesConfig, _get($config, '$games', {}));

export const components = {
    'wlc-category-preview': CategoryPreviewComponent,
    'wlc-game-dashboard': GameDashboardComponent,
    'wlc-game-thumb': GameThumbComponent,
    'wlc-game-wrapper': GameWrapperComponent,
    'wlc-games-catalog': GamesCatalogComponent,
    'wlc-games-grid': GamesGridComponent,
    'wlc-merchant-wallet-exrate': MerchantWalletExrateComponent,
    'wlc-merchant-wallet-form': MerchantWalletFormComponent,
    'wlc-merchant-wallet-info': MerchantWalletInfoComponent,
    'wlc-merchant-wallet-preview': MerchantWalletPreviewComponent,
    'wlc-games-slider': GamesSliderComponent,
    'wlc-play-game-for-real': PlayGameForRealComponent,
    'wlc-random-game': RandomGameComponent,
    'wlc-search': SearchComponent,
    'wlc-search-field': SearchFieldComponent,
    'wlc-dropdown-search': DropdownSearchComponent,
    'wlc-total-jackpot': TotalJackpotComponent,
    'wlc-provider-links': ProviderLinksComponent,
    'wlc-provider-games': ProviderGamesComponent,
    'wlc-lucky-button': LuckyButtonComponent,
    'wlc-favourite-button': FavouriteButtonComponent,
};

export const services = {
    'games-catalog-service': GamesCatalogService,
    'merchant-fields-service': MerchantFieldsService,
    'merchant-wallet-service': MerchantWalletService,
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
        PlayGameForRealComponent,
        RandomGameComponent,
        SearchFieldComponent,
        SearchComponent,
        DropdownSearchComponent,
        TotalJackpotComponent,
        ProviderLinksComponent,
        ProviderGamesComponent,
        ProgressBarComponent,
        MerchantWalletExrateComponent,
        MerchantWalletFormComponent,
        MerchantWalletInfoComponent,
        MerchantWalletPreviewComponent,
        LuckyButtonComponent,
        FavouriteButtonComponent,
    ],
    id: 'GamesModule',
    imports: [
        CommonModule,
        UIRouterModule,
        TranslateModule,
        FormsModule,
        CountUpModule,
        CoreModule,
        CompilerModule,
        IconListModule,
    ],
    providers: [
        GamesCatalogService,
        MerchantFieldsService,
        MerchantWalletService,
    ],
    exports: [
        GamesGridComponent,
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
        ProviderLinksComponent,
        ProviderGamesComponent,
        MerchantWalletExrateComponent,
        MerchantWalletFormComponent,
        MerchantWalletInfoComponent,
        MerchantWalletPreviewComponent,
        LuckyButtonComponent,
        TranslateModule,
    ],
})
export class GamesModule {
}
