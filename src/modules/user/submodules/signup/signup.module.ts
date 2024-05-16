import {NgModule} from '@angular/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';

import {SocialSignUpFormComponent} from './components/social-sign-up-form/social-sign-up-form.component';
import {SignUpFormComponent} from './components/sign-up-form/sign-up-form.component';
import {MetamaskSignUpFormComponent} from './components/metamask-sign-up-form/metamask-sign-up-form.component';
import {SignUpService} from 'wlc-engine/modules/user/submodules/signup/system/services/signup.service';

export const components = {
    'wlc-social-sign-up-form': SocialSignUpFormComponent,
    'wlc-sign-up-form': SignUpFormComponent,
    'wlc-metamask-sign-up-form': MetamaskSignUpFormComponent,
};

export const services = {
    'signup-service': SignUpService,
};

@NgModule({
    declarations: [
        SocialSignUpFormComponent,
        SignUpFormComponent,
        MetamaskSignUpFormComponent,
    ],
    imports: [
        CoreModule,
    ],
    providers: [
        SignUpService,
    ],
    exports: [
        SocialSignUpFormComponent,
        SignUpFormComponent,
    ],
})
export class SignUpModule {
}
