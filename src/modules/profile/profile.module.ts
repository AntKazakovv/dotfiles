import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {UIRouterModule} from '@uirouter/angular';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {
    ShuftiProKycamlComponent,
} from 'wlc-engine/modules/profile/components/shufti-pro-kycaml/shufti-pro-kycaml.component';
import {VerificationComponent} from 'wlc-engine/modules/profile/components';
import {VerificationService} from 'wlc-engine/modules/profile/system/services';
import {VerificationGroupComponent} from './components/verification-group/verification-group.component';
import {BetHistoryComponent} from './components/bet-history/bet-history.component';
import {
    BetPreviewComponent,
} from './components/bet-history/bet-preview/bet-preview.component';
import {HistoryRangeComponent} from './components/history-range/history-range.component';

export const components = {
    'wlc-verification': VerificationComponent,
    'wlc-shufti-pro-kycaml': ShuftiProKycamlComponent,
    'wlc-bet-history': BetHistoryComponent,
    'wlc-history-range': HistoryRangeComponent,
};

@NgModule({
    declarations: [
        ShuftiProKycamlComponent,
        VerificationComponent,
        VerificationGroupComponent,
        BetHistoryComponent,
        BetPreviewComponent,
        HistoryRangeComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        UIRouterModule,
        CoreModule,
    ],
    providers: [
        VerificationService,
    ],
    exports: [
        HistoryRangeComponent,
    ],
})
export class ProfileModule {
}
