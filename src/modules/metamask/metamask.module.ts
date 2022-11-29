import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {IIndexing} from 'wlc-engine/modules/core';
import {MetamaskService} from './system/services/metamask/metamask.service';
import {MetamaskButtonComponent} from './components/metamask-button/metamask-button.component';
import {AmountFormComponent} from './components/amount-form/amount-form.component';

export const services: IIndexing<any> = {
    'metamask-service': MetamaskService,
};

export const components: IIndexing<any> = {
    'wlc-metamask-button': MetamaskButtonComponent,
    'wlc-amount-form': AmountFormComponent,
};

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        CoreModule,
    ],
    providers: [
        MetamaskService,
    ],
    declarations: [
        AmountFormComponent,
        MetamaskButtonComponent,
    ],
    exports: [],
})
export class MetamaskModule {}
