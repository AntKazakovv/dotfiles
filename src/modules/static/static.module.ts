import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {UIRouterModule} from '@uirouter/angular';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {PostComponent} from './components/post/post.component';
import {FaqComponent} from './components/faq/faq.component';
import {PostMenuComponent} from './components/post-menu/post-menu.component';
import {demoTestComponent} from './components/demo-test/demo-test.component';
import {IIndexing, GlobalHelper} from 'wlc-engine/modules/core';
import {StaticService} from 'wlc-engine/modules/static/system/services';
import {IStaticConfig} from './system/interfaces/static.interface';
import {staticConfig} from './system/config/static.config';
import * as $config from 'wlc-config/index';

import {
    get as _get,
} from 'lodash';

export const moduleConfig =
    GlobalHelper.mergeConfig<IStaticConfig>(staticConfig, _get($config, '$static'));

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
    providers: [
        StaticService,
    ],
})
export class StaticModule {
}
