import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {MenuModule} from 'wlc-engine/modules/menu/menu.module';

// components
import {
    AffiliatesMenuComponent,
} from 'wlc-engine/modules/affiliates/components/affiliates-menu/affiliates-menu.component';
import {FaqComponent} from 'wlc-engine/modules/affiliates/components/faq/faq.component';
import {TestimonialsComponent} from 'wlc-engine/modules/affiliates/components/testimonials/testimonials.component';

export const components = {
    'wlc-affiliates-menu': AffiliatesMenuComponent,
    'wlc-faq': FaqComponent,
    'wlc-testimonials': TestimonialsComponent,
};

@NgModule({
    declarations: [
        AffiliatesMenuComponent,
        FaqComponent,
        TestimonialsComponent,
    ],
    imports: [
        CoreModule,
        MenuModule,
        TranslateModule,
    ],
})
export class AffiliatesModule {
}
