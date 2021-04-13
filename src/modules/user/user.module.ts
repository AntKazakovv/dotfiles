import {NgModule} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {TranslateModule} from '@ngx-translate/core';
import {
    DataService,
} from 'wlc-engine/modules/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {
    UserService,
    LimitationService,
} from './system/services';

// Components
import {AddProfileInfoComponent} from './components/add-profile-info/add-profile-info.component';
import {ChangePasswordFormComponent} from './components/change-password-form/change-password-form.component';
import {DashboardLoyaltyBlockComponent} from 'wlc-engine/modules/user/components/dashboard-loyalty-block/dashboard-loyalty-block.component';
import {ExchangeComponent} from './components/dashboard-exchange/exchange.component';
import {LimitationsComponent} from './components/limitations/limitations.component';
import {LimitCancelComponent} from './components/limitations/limit-cancel/limit-cancel.component';
import {LimitValueComponent} from './components/limitations/limit-value/limit-value.component';
import {LoginSignupComponent} from './components/login-signup/login-signup.component';
import {LogoutComponent} from './components/logout/logout.component';
import {LoyaltyProgressComponent} from './components/loyalty-progress/loyalty-progress.component';
import {NewPasswordFormComponent} from './components/new-password-form/new-password-form.component';
import {PhoneFieldComponent} from './components/phone-field/phone-field.component';
import {ProfileFormComponent} from './components/profile-form/profile-form.component';
import {RealityCheckInfoComponent} from 'wlc-engine/modules/user/components/reality-check-info/reality-check-info.component';
import {RestoreLinkComponent} from './components/restore-link/restore-link.component';
import {RestorePasswordFormComponent} from './components/restore-password-form/restore-password-form.component';
import {SignInFormComponent} from './components/sign-in-form/sign-in-form.component';
import {SignUpFormComponent} from './components/sign-up-form/sign-up-form.component';
import {UserInfoComponent} from './components/user-info/user-info.component';
import {UserStatsComponent} from './components/user-stats/user-stats.component';
import {UserNameComponent} from './components/user-name/user-name.component';


export const components = {
    'wlc-add-profile-info': AddProfileInfoComponent,
    'wlc-change-password-form': ChangePasswordFormComponent,
    'wlc-exchange': ExchangeComponent,
    'wlc-limitations': LimitationsComponent,
    'wlc-login-signup': LoginSignupComponent,
    'wlc-logout': LogoutComponent,
    'wlc-loyalty-block': DashboardLoyaltyBlockComponent,
    'wlc-loyalty-progress': LoyaltyProgressComponent,
    'wlc-new-password-form': NewPasswordFormComponent,
    'wlc-profile-form': ProfileFormComponent,
    'wlc-phone-field': PhoneFieldComponent,
    'wlc-reality-check-info': RealityCheckInfoComponent,
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
        AddProfileInfoComponent,
        ChangePasswordFormComponent,
        DashboardLoyaltyBlockComponent,
        ExchangeComponent,
        LimitationsComponent,
        LimitCancelComponent,
        LimitValueComponent,
        LoginSignupComponent,
        LogoutComponent,
        LoyaltyProgressComponent,
        NewPasswordFormComponent,
        ProfileFormComponent,
        PhoneFieldComponent,
        RealityCheckInfoComponent,
        RestoreLinkComponent,
        RestorePasswordFormComponent,
        SignInFormComponent,
        SignUpFormComponent,
        UserInfoComponent,
        UserStatsComponent,
        UserNameComponent,
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
        LimitationService,
    ],
    exports: [
        AddProfileInfoComponent,
        ChangePasswordFormComponent,
        DashboardLoyaltyBlockComponent,
        ExchangeComponent,
        LimitationsComponent,
        LoginSignupComponent,
        LogoutComponent,
        LoyaltyProgressComponent,
        ProfileFormComponent,
        PhoneFieldComponent,
        RealityCheckInfoComponent,
        RestorePasswordFormComponent,
        SignInFormComponent,
        SignUpFormComponent,
        UserInfoComponent,
        UserStatsComponent,
        UserNameComponent,
    ],
})
export class UserModule {
}
