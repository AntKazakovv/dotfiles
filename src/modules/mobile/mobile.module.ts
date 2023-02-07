import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {MobileHeaderComponent} from './components/core/mobile-header/mobile-header.component';
import {WelcomeComponent} from './components/core/welcome/welcome.component';
import {RunGameComponent} from './components/games/run-game/run-game.component';
import {SidebarMenuComponent} from './components/menu/sidebar-menu/sidebar-menu.component';
import {AppUpdaterComponent} from './components/core/app-updater/app-updater.component';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {mobileConfig} from './system/config/mobile.config';
import {IMobileConfig} from './system/interfaces/mobile.interface';
import * as $config from 'wlc-config/index';

import _get from 'lodash-es/get';

export const moduleConfig =
    GlobalHelper.mergeConfig<IMobileConfig>(mobileConfig, _get($config, '$mobile', {}));

export const components = {
    'wlc-mobile-header': MobileHeaderComponent,
    'wlc-welcome': WelcomeComponent,
    'wlc-run-game': RunGameComponent,
    'wlc-sidebar-menu': SidebarMenuComponent,
    'wlc-app-updater': AppUpdaterComponent,
};

export const services = {};

@NgModule({
    declarations: [
        MobileHeaderComponent,
        WelcomeComponent,
        RunGameComponent,
        SidebarMenuComponent,
        AppUpdaterComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        UIRouterModule,
        CoreModule,
    ],
})
export class MobileModule {
}
