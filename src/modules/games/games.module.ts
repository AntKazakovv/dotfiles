import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {TranslateModule} from '@ngx-translate/core';
import {AngularResizedEventModule} from 'angular-resize-event';
import {GamesCatalogService} from './services';
import {FormsModule} from '@angular/forms';
import {CategoriesService} from 'wlc-engine/modules/games';
import {GamesGridComponent} from './components/games-grid/games-grid.component';
import {GameThumbComponent} from './components/game-thumb/game-thumb.component';
import {GameWrapperComponent} from './components/game-wrapper/game-wrapper.component';
import {CoreModule} from '../core/core.module';
import {SearchFieldComponent} from './components/search-field/search-field.component';
import {SearchComponent} from './components/search/search.component';

export const components = {
    'wlc-games-grid': GamesGridComponent,
    'wlc-game-thumb': GameThumbComponent,
    'wlc-game-wrapper': GameWrapperComponent,
    'wlc-search-field': SearchFieldComponent,
};

@NgModule({
    declarations: [
        GamesGridComponent,
        GameThumbComponent,
        GameWrapperComponent,
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
        GameWrapperComponent,
        SearchFieldComponent,
        SearchComponent,
    ],
})
export class GamesModule {
}
