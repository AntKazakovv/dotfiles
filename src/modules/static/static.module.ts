import {NgModule} from '@angular/core';
import {UIRouterModule} from '@uirouter/angular';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {PostComponent} from './components/post/post.component';
import {PromoStepsComponent} from './components/promo-steps/promo-steps.component';
import {WpPromoComponent} from 'wlc-engine/modules/static/components/wp-promo/wp-promo.component';
import {InstructionComponent} from 'wlc-engine/modules/static/components/instruction/instruction.component';
import {GlobalHelper} from 'wlc-engine/modules/core';
import {StaticService, IStaticConfig} from 'wlc-engine/modules/static';
import {staticConfig} from './system/config/static.config';
import {CompilerModule} from 'wlc-engine/modules/compiler';
import * as $config from 'wlc-config/index';

import _get from 'lodash-es/get';

export const moduleConfig =
    GlobalHelper.mergeConfig<IStaticConfig>(staticConfig, _get($config, '$static'));

export const components = {
    'wlc-post': PostComponent,
    'wlc-promo-steps': PromoStepsComponent,
    'wlc-wp-promo': WpPromoComponent,
    'wlc-instruction': InstructionComponent,
};

export const services = {
    'static-service': StaticService,
};

@NgModule({
    declarations: [
        PostComponent,
        PromoStepsComponent,
        WpPromoComponent,
        InstructionComponent,
    ],
    id: 'StaticModule',
    imports: [
        UIRouterModule,
        CoreModule,
        CompilerModule,
    ],
    exports: [
        PostComponent,
        PromoStepsComponent,
        WpPromoComponent,
        InstructionComponent,
    ],
    providers: [
        StaticService,
    ],
})
export class StaticModule {
}
