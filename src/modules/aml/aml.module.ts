import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {ShuftiProKycamlComponent} from './components/shufti-pro-kycaml/shufti-pro-kycaml.component';

export const components = {
    'wlc-shufti-pro-kycaml': ShuftiProKycamlComponent,
};

@NgModule({
    declarations: [
        ShuftiProKycamlComponent,
    ],
    imports: [
        CoreModule,
        CommonModule,
        TranslateModule,
    ],
    exports:[],
})
export class AmlModule {
}
