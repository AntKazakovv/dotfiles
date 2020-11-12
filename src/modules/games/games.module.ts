import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {TranslateModule} from '@ngx-translate/core';
import {AngularResizedEventModule} from 'angular-resize-event';
import {GamesCatalogService} from './services/games-catalog.service';
import {FormsModule} from '@angular/forms';
import {CategoriesService} from 'wlc-engine/modules/games';

import {GamesGridComponent} from './components/games-grid/games-grid.component';
import {CoreModule} from '../core/core.module';
import {SearchFieldComponent} from './components/search-field/search-field.component';
import {SearchComponent} from './components/search/search.component';

export const components = {
    'wlc-games-grid': GamesGridComponent,
    'wlc-search-field': SearchFieldComponent,
};

@NgModule({
    declarations: [
        GamesGridComponent,
        SearchFieldComponent,
        SearchComponent,
    ],
    id: 'GamesModule',
    imports: [
        CommonModule,
        CoreModule,
        UIRouterModule,
        TranslateModule,
        AngularResizedEventModule,
        FormsModule,
    ],
    providers: [
        GamesCatalogService,
        CategoriesService,
    ],
    exports: [
        GamesGridComponent,
        SearchFieldComponent,
        SearchComponent,
    ],
})
export class GamesModule {
}
