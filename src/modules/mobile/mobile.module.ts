import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {mobileConfig} from './system/config/mobile.config';
import {IMobileConfig} from './system/interfaces/mobile.interface';
import * as $config from 'wlc-config/index';

import _get from 'lodash-es/get';

export const moduleConfig =
    GlobalHelper.mergeConfig<IMobileConfig>(mobileConfig, _get($config, '$mobile', {}));

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
    ],
})
export class MobileModule {
}
