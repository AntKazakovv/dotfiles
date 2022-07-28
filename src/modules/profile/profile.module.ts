import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {UIRouterModule} from '@uirouter/angular';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {
    ShuftiProKycamlComponent,
} from 'wlc-engine/modules/profile/components/shufti-pro-kycaml/shufti-pro-kycaml.component';
import {VerificationComponent} from 'wlc-engine/modules/profile/components/verification/verification.component';
import {
    ProfileNoContentComponent,
} from 'wlc-engine/modules/profile/components/profile-no-content/profile-no-content.component';
import {VerificationService} from 'wlc-engine/modules/profile/system/services';
import {
    VerificationGroupComponent,
} from 'wlc-engine/modules/profile/components/verification-group/verification-group.component';
import {BetHistoryComponent} from 'wlc-engine/modules/profile/components/bet-history/bet-history.component';
import {
    BetPreviewComponent,
} from './components/bet-history/bet-preview/bet-preview.component';
import {HistoryRangeComponent} from './components/history-range/history-range.component';

export const components = {
    'wlc-profile-no-content': ProfileNoContentComponent,
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
        ProfileNoContentComponent,
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
        ProfileNoContentComponent,
    ],
})
export class ProfileModule {
}
