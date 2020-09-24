import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {LayoutComponent} from './components/layout/layout.component';
import {NgTemplateNameDirective} from './directives/template-name/template-name.directive';
import {ConfigService, DataService, EventService, FilesService} from './services';
import {BaseModule} from 'wlc-engine/modules/base/base.module';

@NgModule({
    imports: [
        CommonModule,
        BaseModule,
    ],
    providers: [
        DataService,
        EventService,
        ConfigService,
        FilesService,
    ],
    declarations: [
        LayoutComponent,
        NgTemplateNameDirective,
    ],
    exports: [
        LayoutComponent,
        NgTemplateNameDirective,
        BaseModule,
    ]
})
export class CoreModule {
}
