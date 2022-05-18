import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {UIRouterModule} from '@uirouter/angular';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {PostComponent} from './components/post/post.component';
import {FaqComponent} from './components/faq/faq.component';
import {TestimonialsComponent} from './components/testimonials/testimonials.component';
import {PromoStepsComponent} from './components/promo-steps/promo-steps.component';
import {WpPromoComponent} from 'wlc-engine/modules/static/components/wp-promo/wp-promo.component';
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
    'wlc-faq': FaqComponent,
    'wlc-testimonials': TestimonialsComponent,
    'wlc-promo-steps': PromoStepsComponent,
    'wlc-wp-promo': WpPromoComponent,
};

export const services = {
    'static-service': StaticService,
};

@NgModule({
    declarations: [
        PostComponent,
        FaqComponent,
        TestimonialsComponent,
        PromoStepsComponent,
        WpPromoComponent,
    ],
    id: 'StaticModule',
    imports: [
        CommonModule,
        TranslateModule,
        UIRouterModule,
        CoreModule,
        CompilerModule,
    ],
    exports: [
        PostComponent,
        FaqComponent,
        TestimonialsComponent,
        PromoStepsComponent,
        WpPromoComponent,
    ],
    providers: [
        StaticService,
    ],
})
export class StaticModule {
}
