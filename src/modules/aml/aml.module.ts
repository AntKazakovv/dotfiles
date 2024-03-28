import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {ShuftiProKycamlComponent} from './components/shufti-pro-kycaml/shufti-pro-kycaml.component';
import {KycQuestionnaireInfoComponent} from './components/kyc-questionnaire-info/kyc-questionnaire-info.component';
import {KycQuestionnaireComponent} from './components/kyc-questionnaire/kyc-questionnaire.component';

export const components = {
    'wlc-shufti-pro-kycaml': ShuftiProKycamlComponent,
    'wlc-kyc-questionnaire-info': KycQuestionnaireInfoComponent,
    'wlc-kyc-questionnaire': KycQuestionnaireComponent,
};

export const services = {
};

@NgModule({
    declarations: [
        ShuftiProKycamlComponent,
        KycQuestionnaireInfoComponent,
        KycQuestionnaireComponent,
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
