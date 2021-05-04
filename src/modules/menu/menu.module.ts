import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {AffiliatesMenuComponent} from './components/affiliates-menu/affiliates-menu.component';
import {CategoryMenuComponent} from './components/category-menu/category-menu.component';
import {MenuComponent} from './components/menu/menu.component';
import {MainMenuComponent} from './components/main-menu/main-menu.component';
import {MobileMenuComponent} from './components/mobile-menu/mobile-menu.component';
import {ProfileMenuComponent} from './components/profile-menu/profile-menu.component';
import {PromoModule} from 'wlc-engine/modules/promo/promo.module';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {menuConfig} from './system/config/menu.config';
import {IMenuConfig} from './system/interfaces/menu.interface';
import * as $config from 'wlc-config/index';

import _get from 'lodash-es/get';

export const moduleConfig =
    GlobalHelper.mergeConfig<IMenuConfig>(menuConfig, _get($config, '$menu', {}));

export const components = {
    'wlc-affiliates-menu': AffiliatesMenuComponent,
    'wlc-category-menu': CategoryMenuComponent,
    'wlc-menu': MenuComponent,
    'wlc-main-menu': MainMenuComponent,
    'wlc-mobile-menu': MobileMenuComponent,
    'wlc-profile-menu': ProfileMenuComponent,
};

@NgModule({
    id: 'MenuModule',
    declarations: [
        AffiliatesMenuComponent,
        CategoryMenuComponent,
        MenuComponent,
        MainMenuComponent,
        MobileMenuComponent,
        ProfileMenuComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        UIRouterModule,
        CoreModule,
        PromoModule,
    ],
    exports: [
        ProfileMenuComponent,
        MenuComponent,
    ],
})
export class MenuModule {
}
