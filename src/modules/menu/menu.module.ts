import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {ProfileMenuComponent} from './components/profile-menu/profile-menu.component';
import {MenuComponent} from './components/menu/menu.component';
import {MainMenuComponent} from './components/main-menu/main-menu.component';
import {CategoryMenuComponent} from './components/category-menu/category-menu.component';
import {MobileMenuComponent} from './components/mobile-menu/mobile-menu.component';

export const components = {
    'wlc-menu': MenuComponent,
    'wlc-main-menu': MainMenuComponent,
    'wlc-category-menu': CategoryMenuComponent,
    'wlc-profile-menu': ProfileMenuComponent,
    'wlc-mobile-menu': MobileMenuComponent,
};

@NgModule({
    id: 'MenuModule',
    declarations: [
        MenuComponent,
        MainMenuComponent,
        CategoryMenuComponent,
        ProfileMenuComponent,
        MobileMenuComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        UIRouterModule,
        CoreModule,
    ],
    exports: [
        ProfileMenuComponent,
    ],
})
export class MenuModule {
}
