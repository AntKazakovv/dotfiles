import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {TranslateModule} from '@ngx-translate/core';
import {AngularResizedEventModule} from 'angular-resize-event';
import {GamesCatalogService} from './services/games-catalog.service';
import {CategoriesService} from 'wlc-engine/modules/games';

import {GamesGridComponent} from './components/games-grid/games-grid.component';
import {CoreModule} from '../core/core.module';

export const components = {
    'wlc-games-grid': GamesGridComponent,
};

@NgModule({
    declarations: [
        GamesGridComponent,
    ],
    id: 'GamesModule',
    imports: [
        CommonModule,
        CoreModule,
        UIRouterModule,
        TranslateModule,
        AngularResizedEventModule,
    ],
    providers: [
        GamesCatalogService,
        CategoriesService,
    ],
    exports: [
        GamesGridComponent,
    ],
})
export class GamesModule {
}
