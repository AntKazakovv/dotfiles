import {NgModule} from '@angular/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {CompilerModule} from 'wlc-engine/modules/compiler';
import {ReferralInfoComponent} from 'wlc-engine/modules/referrals/components/referral-info/referral-info.component';
import {ReferralsService} from 'wlc-engine/modules/referrals/system/services/referrals.service';
import {ReferralsListComponent}
    from 'wlc-engine/modules/referrals/components/referrals-list/referrals-list.component';

export const components = {
    'wlc-referral-info': ReferralInfoComponent,
    'wlc-referrals-list': ReferralsListComponent,
};

export const services = {
    'referrals-service': ReferralsService,
};

@NgModule({
    declarations: [
        ReferralInfoComponent,
        ReferralsListComponent,
    ],
    imports: [
        CoreModule,
        CompilerModule,
    ],
    exports: [
        ReferralInfoComponent,
        ReferralsListComponent,
    ],
    providers: [
        ReferralsService,
    ],
})
export class ReferralsModule {}
