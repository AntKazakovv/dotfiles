import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';

import {MenuComponent} from './components/menu/menu.component';
import {MainMenuComponent} from './components/main-menu/main-menu.component';
import {CategoryMenuComponent} from './components/category-menu/category-menu.component';

export const components = {
    'wlc-menu': MenuComponent,
    'wlc-main-menu': MainMenuComponent,
    'wlc-category-menu': CategoryMenuComponent,
};

@NgModule({
    id: 'MenuModule',
    declarations: [
        MenuComponent,
        MainMenuComponent,
        CategoryMenuComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        UIRouterModule,
        CoreModule,
    ],
})
export class MenuModule {
}
