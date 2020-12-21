import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
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
import {SignUpFormComponent} from './components/sign-up-form/sign-up-form.component';
import {UserInfoComponent} from './components/user-info/user-info.component';
import {UserStatsComponent} from './components/user-stats/user-stats.component';
import {LogoutComponent} from './components/logout/logout.component';


export const components = {
    'wlc-login-signup': LoginSignupComponent,
    'wlc-profile-form': ProfileFormComponent,
    'wlc-sign-up-form': SignUpFormComponent,
    'wlc-sign-in-form': SignInFormComponent,
    'wlc-have-account': HaveAccountComponent,
    'wlc-pseudo-link': PseudoLinkComponent,
    'wlc-change-password-form': ChangePasswordFormComponent,
    'wlc-restore-password-form': RestorePasswordFormComponent,
    'wlc-user-info': UserInfoComponent,
    'wlc-user-stats': UserStatsComponent,
    'wlc-logout': LogoutComponent,
};

@NgModule({
    declarations: [
        HaveAccountComponent,
        LoginSignupComponent,
        SignupBonusComponent,
        TempLogoutComponent,
        ProfileFormComponent,
        SignInFormComponent,
        PseudoLinkComponent,
        ChangePasswordFormComponent,
        RestorePasswordFormComponent,
        SignUpFormComponent,
        UserInfoComponent,
        UserStatsComponent,
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
        HaveAccountComponent,
        LoginSignupComponent,
        TempLogoutComponent,
        ProfileFormComponent,
        SignInFormComponent,
        ChangePasswordFormComponent,
        RestorePasswordFormComponent,
        SignUpFormComponent,
        UserInfoComponent,
        UserStatsComponent,
    ],
})
export class UserModule {
}
