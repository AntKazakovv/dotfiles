import {NgModule} from '@angular/core';
import {UIRouterModule} from '@uirouter/angular';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {VerificationComponent} from 'wlc-engine/modules/profile/components/verification/verification.component';
import {
    ProfileNoContentComponent,
} from 'wlc-engine/modules/profile/components/profile-no-content/profile-no-content.component';
import {VerificationService} from 'wlc-engine/modules/profile/system/services';
import {
    VerificationGroupComponent,
} from 'wlc-engine/modules/profile/components/verification-group/verification-group.component';

export const components = {
    'wlc-profile-no-content': ProfileNoContentComponent,
    'wlc-verification': VerificationComponent,
};

@NgModule({
    declarations: [
        VerificationComponent,
        VerificationGroupComponent,
        ProfileNoContentComponent,
    ],
    imports: [
        UIRouterModule,
        CoreModule,
    ],
    providers: [
        VerificationService,
    ],
    exports: [
        ProfileNoContentComponent,
    ],
})
export class ProfileModule {
}
