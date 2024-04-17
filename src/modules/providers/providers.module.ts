import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

// Modules
import {IconListModule} from 'wlc-engine/modules/icon-list/icon-list.module';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {GamesModule} from 'wlc-engine/modules/games/games.module';

// Components
import {ProviderLinksComponent} from './components/provider-links/provider-links.component';
import {ProviderGamesComponent} from './components/provider-games/provider-games.component';

export const components = {
    'wlc-provider-links': ProviderLinksComponent,
    'wlc-provider-games': ProviderGamesComponent,
};

@NgModule({
    declarations: [
        ProviderLinksComponent,
        ProviderGamesComponent,
    ],
    id: 'ProvidersModule',
    imports: [
        CoreModule,
        CommonModule,
        TranslateModule,
        IconListModule,
        GamesModule,
    ],
    providers: [
    ],
    exports: [
        ProviderLinksComponent,
        ProviderGamesComponent,
        TranslateModule,
    ],
})
export class ProvidersModule {
}
