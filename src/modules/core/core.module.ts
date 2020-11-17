import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {
    HAMMER_GESTURE_CONFIG,
    HammerModule,
} from '@angular/platform-browser';
import {TranslateModule} from '@ngx-translate/core';

import {LayoutComponent} from './components/layout/layout.component';
import {NgTemplateNameDirective} from './directives/template-name/template-name.directive';
import {
    ConfigService,
    DataService,
    EventService,
    FilesService,
    LogService,
    SentryService,
    ActionService,
} from './services';
import {BaseModule} from 'wlc-engine/modules/base/base.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BannersService} from 'wlc-engine/modules/promo/services';
import {BurgerPanelComponent} from './components/burger-panel/burger-panel.component';
import {FloatPanelsComponent} from './components/float-panels/float-panels.component';
import {HammerConfig} from 'wlc-engine/config/hammer.config';
import {WrapperComponent} from 'wlc-engine/modules/core/components/wrapper/wrapper.component';

@NgModule({
    imports: [
        CommonModule,
        BaseModule,
        BrowserAnimationsModule,
        HammerModule,
        TranslateModule,
    ],
    providers: [
        DataService,
        EventService,
        ConfigService,
        FilesService,
        LogService,
        SentryService,
        ActionService,
        BannersService,
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: HammerConfig,
        },
    ],
    declarations: [
        LayoutComponent,
        NgTemplateNameDirective,
        BurgerPanelComponent,
        FloatPanelsComponent,
        WrapperComponent,
    ],
    exports: [
        LayoutComponent,
        NgTemplateNameDirective,
        BaseModule,
        BrowserAnimationsModule,
        BurgerPanelComponent,
        FloatPanelsComponent,
        WrapperComponent,
    ],
})
export class CoreModule {
}
