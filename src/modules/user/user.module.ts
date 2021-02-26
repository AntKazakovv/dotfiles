import {NgModule} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';

import {TranslateModule} from '@ngx-translate/core';

import {DataService} from 'wlc-engine/modules/core/system/services';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {UserService} from './system/services';

// Components
import {ChangePasswordFormComponent} from './components/change-password-form/change-password-form.component';
import {LogoutComponent} from './components/logout/logout.component';
import {LoginSignupComponent} from './components/login-signup/login-signup.component';
import {NewPasswordFormComponent} from './components/new-password-form/new-password-form.component';
import {ProfileFormComponent} from './components/profile-form/profile-form.component';
import {RestoreLinkComponent} from './components/restore-link/restore-link.component';
import {RestorePasswordFormComponent} from './components/restore-password-form/restore-password-form.component';
import {SignInFormComponent} from './components/sign-in-form/sign-in-form.component';
import {SignUpFormComponent} from './components/sign-up-form/sign-up-form.component';
import {UserInfoComponent} from './components/user-info/user-info.component';
import {UserStatsComponent} from './components/user-stats/user-stats.component';
import {UserNameComponent} from './components/user-name/user-name.component';
import {LoyaltyProgressComponent} from './components/loyalty-progress/loyalty-progress.component';
import {DashboardLoyaltyBlockComponent} from 'wlc-engine/modules/user/components/dashboard-loyalty-block/dashboard-loyalty-block.component';
import {ExchangeComponent} from './components/dashboard-exchange/exchange.component';
import {PhoneFieldComponent} from './components/phone-field/phone-field.component';



export const components = {
    'wlc-change-password-form': ChangePasswordFormComponent,
    'wlc-exchange': ExchangeComponent,
    'wlc-logout': LogoutComponent,
    'wlc-login-signup': LoginSignupComponent,
    'wlc-loyalty-progress': LoyaltyProgressComponent,
    'wlc-loyalty-block': DashboardLoyaltyBlockComponent,
    'wlc-new-password-form': NewPasswordFormComponent,
    'wlc-profile-form': ProfileFormComponent,
    'wlc-phone-field': PhoneFieldComponent,
    'wlc-restore-link': RestoreLinkComponent,
    'wlc-restore-password-form': RestorePasswordFormComponent,
    'wlc-sign-in-form': SignInFormComponent,
    'wlc-sign-up-form': SignUpFormComponent,
    'wlc-user-info': UserInfoComponent,
    'wlc-user-stats': UserStatsComponent,
    'wlc-user-name': UserNameComponent,
};

@NgModule({
    declarations: [
        ChangePasswordFormComponent,
        ExchangeComponent,
        LoginSignupComponent,
        LoyaltyProgressComponent,
        DashboardLoyaltyBlockComponent,
        NewPasswordFormComponent,
        ProfileFormComponent,
        PhoneFieldComponent,
        RestoreLinkComponent,
        RestorePasswordFormComponent,
        SignInFormComponent,
        SignUpFormComponent,
        UserInfoComponent,
        UserStatsComponent,
        UserNameComponent,
        LogoutComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        UIRouterModule,
    ],
    providers: [
        DataService,
        UserService,
    ],
    exports: [
        ChangePasswordFormComponent,
        ExchangeComponent,
        LoginSignupComponent,
        LoyaltyProgressComponent,
        DashboardLoyaltyBlockComponent,
        ProfileFormComponent,
        PhoneFieldComponent,
        RestorePasswordFormComponent,
        SignInFormComponent,
        SignUpFormComponent,
        UserInfoComponent,
        UserStatsComponent,
        UserNameComponent,
        LogoutComponent,
    ],
})
export class UserModule {
}
