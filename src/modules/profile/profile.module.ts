import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {UIRouterModule} from '@uirouter/angular';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {VerificationComponent} from 'wlc-engine/modules/profile/components';
import {VerificationService} from 'wlc-engine/modules/profile/system/services';
import {VerificationGroupComponent} from './components/verification-group/verification-group.component';


export const components = {
    'wlc-verification': VerificationComponent,
};

@NgModule({
    declarations: [
        VerificationComponent,
        VerificationGroupComponent,
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
    exports: [],
})
export class ProfileModule {
}
