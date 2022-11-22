import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {MobileHeaderComponent} from './components/core/mobile-header/mobile-header.component';
import {WelcomeComponent} from './components/core/welcome/welcome.component';

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
};

export const services = {};

@NgModule({
    declarations: [
        MobileHeaderComponent,
        WelcomeComponent,
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
