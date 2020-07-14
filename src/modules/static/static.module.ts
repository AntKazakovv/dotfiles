import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {UIRouterModule} from '@uirouter/angular';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {PostComponent} from './components/post/post.component';

export const components = {
    'wlc-post': PostComponent,
};

@NgModule({
    declarations: [
        PostComponent
    ],
    id: 'StaticModule',
    imports: [
        CommonModule,
        TranslateModule,
        UIRouterModule,
        CoreModule,
    ],
    exports: [
        PostComponent
    ]
})
export class StaticModule {
}
