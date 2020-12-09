import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {HaveAccountComponent} from './components/have-account/have-account.component';
import {UserService} from './system/services';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {DataService} from 'wlc-engine/modules/core/system/services';
// Components
import {LoginSignupComponent} from './components/login-signup/login-signup.component';
import {SignupBonusComponent} from './components/signup-bonus/signup-bonus.component';
import {TempLogoutComponent} from './components/temp-logout/temp-logout.component';
import {ProfileFormComponent} from './components/profile-form/profile-form.component';
import {SignInFormComponent} from './components/sign-in-form/sign-in-form.component';
import {PseudoLinkComponent} from './components/pseudo-link/pseudo-link.component';
import {ChangePasswordFormComponent} from './components/change-password-form/change-password-form.component';
import {RestorePasswordFormComponent} from './components/restore-password-form/restore-password-form.component';


export const components = {
    'wlc-login-signup': LoginSignupComponent,
    'wlc-temp-logout': TempLogoutComponent,
    'wlc-profile-form': ProfileFormComponent,
    'wlc-sign-in-form': SignInFormComponent,
    'wlc-have-account': HaveAccountComponent,
    'wlc-pseudo-link': PseudoLinkComponent,
    'wlc-change-password-form': ChangePasswordFormComponent,
    'wlc-restore-password-form': RestorePasswordFormComponent,
};

@NgModule({
    declarations: [
        SignUpComponent,
        HaveAccountComponent,
        LoginSignupComponent,
        SignupBonusComponent,
        TempLogoutComponent,
        ProfileFormComponent,
        SignInFormComponent,
        PseudoLinkComponent,
        ChangePasswordFormComponent,
        RestorePasswordFormComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        CoreModule,
    ],
    providers: [
        UserService,
        DataService,
    ],
    exports: [
        SignUpComponent,
        HaveAccountComponent,
        LoginSignupComponent,
        TempLogoutComponent,
        ProfileFormComponent,
        SignInFormComponent,
        ChangePasswordFormComponent,
        RestorePasswordFormComponent,
    ],
})
export class UserModule {
}
