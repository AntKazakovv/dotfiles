import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataService, EventService, ConfigService} from './services';
import {LayoutComponent} from './components/layout/layout.component';

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
    ],
    exports: [
        LayoutComponent,
    ]
})
export class CoreModule {}
