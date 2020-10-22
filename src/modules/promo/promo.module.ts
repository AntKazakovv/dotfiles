import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {BannersService} from './services';
import {BaseModule} from 'wlc-engine/modules/base/base.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        CommonModule,
        BaseModule,
        BrowserAnimationsModule,
    ],
    providers: [
        BannersService,
    ],
    exports: [
        BaseModule,
        BrowserAnimationsModule,
    ],
})
export class PromoModule {}
