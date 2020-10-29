import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {UIRouterModule} from '@uirouter/angular';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {PostComponent} from './components/post/post.component';
import {FaqComponent} from './components/faq/faq.component';
import {PostMenuComponent} from './components/post-menu/post-menu.component';
import {demoTestComponent} from './components/demo-test/demo-test.component';

export const components = {
    'wlc-post': PostComponent,
    'wlc-demo-test': demoTestComponent,
    'wlc-faq': FaqComponent,
    'wlc-post-menu': PostMenuComponent,
};

@NgModule({
    declarations: [
        PostComponent,
        demoTestComponent,
        FaqComponent,
        PostMenuComponent,
    ],
    id: 'StaticModule',
    imports: [
        CommonModule,
        TranslateModule,
        UIRouterModule,
        CoreModule,
    ],
    exports: [
        PostComponent,
        demoTestComponent,
        FaqComponent,
        PostMenuComponent,
    ],
})
export class StaticModule {
}
