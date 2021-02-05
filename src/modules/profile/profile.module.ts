import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {UIRouterModule} from '@uirouter/angular';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {VerificationComponent} from './components/verification/verification.component';
import {VerificationService} from './system/services/verification/verification.service';

export const components = {
    'wlc-verification': VerificationComponent,
};

@NgModule({
    declarations: [
        VerificationComponent,
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
