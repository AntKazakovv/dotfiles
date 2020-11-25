import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {TempContainerComponent} from './components/temp-container/temp-container.component';
import {SignInComponent} from './components/sign-in/sign-in.component';
import {PasswordRestoreComponent} from './components/password-restore/password-restore.component';
import {PasswordChangeComponent} from './components/password-change/password-change.component';
import {HaveAccountComponent} from './components/have-account/have-account.component';
import {UserService} from './services/user.service';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {DataService} from 'wlc-engine/modules/core/services';
// Components
import {LoginSignupComponent} from './components/login-signup/login-signup.component';
import {SignupBonusComponent} from './components/signup-bonus/signup-bonus.component';
import {TempLogoutComponent} from './components/temp-logout/temp-logout.component';


export const components = {
    'wlc-temp-container': TempContainerComponent,
    'wlc-login-signup': LoginSignupComponent,
    'wlc-temp-logout': TempLogoutComponent,
};

@NgModule({
    declarations: [
        TempContainerComponent,
        SignUpComponent,
        SignInComponent,
        PasswordRestoreComponent,
        PasswordChangeComponent,
        HaveAccountComponent,
        LoginSignupComponent,
        SignupBonusComponent,
        TempLogoutComponent,
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
        SignInComponent,
        PasswordRestoreComponent,
        PasswordChangeComponent,
        HaveAccountComponent,
        LoginSignupComponent,
        TempLogoutComponent,
    ],
})
export class UserModule {
}
