import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {BaseModule} from 'wlc-engine/modules/base/base.module';
import {LogService} from './services';

@NgModule({
    imports: [
        CommonModule,
        BaseModule,
    ],
    providers: [
        LogService,
    ],
})
export class LogModule {
}
