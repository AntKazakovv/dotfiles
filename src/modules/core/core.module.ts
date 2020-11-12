import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {LayoutComponent} from './components/layout/layout.component';
import {NgTemplateNameDirective} from './directives/template-name/template-name.directive';
import {
    ConfigService,
    DataService,
    EventService,
    FilesService,
    LogService,
} from './services';
import {BaseModule} from 'wlc-engine/modules/base/base.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BannersService} from 'wlc-engine/modules/promo/services';
import {WrapperComponent} from 'wlc-engine/modules/core/components/wrapper/wrapper.component';

@NgModule({
    imports: [
        CommonModule,
        BaseModule,
        BrowserAnimationsModule,
    ],
    providers: [
        DataService,
        EventService,
        ConfigService,
        FilesService,
        LogService,
        BannersService,
    ],
    declarations: [
        LayoutComponent,
        NgTemplateNameDirective,
        WrapperComponent,
    ],
    exports: [
        LayoutComponent,
        NgTemplateNameDirective,
        BaseModule,
        BrowserAnimationsModule,
        WrapperComponent,
    ],
})
export class CoreModule {
}
