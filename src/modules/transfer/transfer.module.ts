import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';

import {TransferService} from './system/services';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {TransferComponent} from './components/transfer/transfer.component';
import {
    TransferCodeFormComponent,
} from './components/transfer-code-form/transfer-code-form.component';

export const components = {
    'wlc-transfer': TransferComponent,
};

export const services = {
    'transfer-service': TransferService,
};

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        FormsModule,
        TranslateModule,
    ],
    declarations: [
        TransferComponent,
        TransferCodeFormComponent,
    ],
    providers: [
        TransferService,
    ],
    exports: [],
})
export class TransferModule {
}
