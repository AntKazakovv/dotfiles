import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {LayoutComponent} from './components/layout/layout.component';
import {NgTemplateNameDirective} from 'wlc-engine/modules/core/directives/template-name/template-name.directive';
import {ConfigService, DataService, EventService} from './services';

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        DataService,
        EventService,
        ConfigService,
    ],
    declarations: [
        LayoutComponent,
        NgTemplateNameDirective,
    ],
    exports: [
        LayoutComponent,
        NgTemplateNameDirective,
    ]
})
export class CoreModule {
}
