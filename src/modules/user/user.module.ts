import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {TranslateModule} from '@ngx-translate/core';
import {
    DataService,
} from 'wlc-engine/modules/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {
    UserService,
    SmsService,
    SocialService,
    TermsAcceptService,
} from './system/services';
import {IdleService} from 'wlc-engine/modules/user/system/services/idle/idle.service';

// Components
import {AcceptTermsComponent} from 'wlc-engine/modules/user/components/terms-accept/terms-accept.component';
import {AddProfileInfoComponent} from './components/add-profile-info/add-profile-info.component';
import {ChangePasswordFormComponent} from './components/change-password-form/change-password-form.component';
import {
    DashboardLoyaltyBlockComponent,
} from 'wlc-engine/modules/user/components/dashboard-loyalty-block/dashboard-loyalty-block.component';
import {ExchangeComponent} from './components/dashboard-exchange/exchange.component';
import {FundistUserIdComponent} from './components/fundist-id/fundist-user-id.component';
import {IconExpLpDescriptionComponent} from './components/icon-exp-lp-description/icon-exp-lp-description.component';
import {LogoutComponent} from './components/logout/logout.component';
import {LoyaltyProgressComponent} from './components/loyalty-progress/loyalty-progress.component';
import {MetamaskSignUpFormComponent} from './components/metamask-sign-up-form/metamask-sign-up-form.component';
import {NewPasswordFormComponent} from './components/new-password-form/new-password-form.component';
import {PhoneFieldComponent} from './components/phone-field/phone-field.component';
import {ProfileFormComponent} from './components/profile-form/profile-form.component';
import {ProfileBlocksComponent} from './components/profile-blocks/profile-blocks.component';
import {
    RealityCheckInfoComponent,
} from 'wlc-engine/modules/user/components/reality-check-info/reality-check-info.component';
import {RestoreLinkComponent} from './components/restore-link/restore-link.component';
import {RestorePasswordFormComponent} from './components/restore-password-form/restore-password-form.component';
import {SignInFormComponent} from './components/sign-in-form/sign-in-form.component';
import {SignUpFormComponent} from './components/sign-up-form/sign-up-form.component';
import {SmsVerificationComponent} from './components/sms-verification/sms-verification.component';
import {UserInfoComponent} from './components/user-info/user-info.component';
import {UserStatsComponent} from './components/user-stats/user-stats.component';
import {UserNameComponent} from './components/user-name/user-name.component';
import {SocialNetworksComponent} from './components/social-networks/social-networks.component';
import {SocialSignUpFormComponent} from './components/social-sign-up-form/social-sign-up-form.component';
import {RestoreSmsCodeFormComponent} from './components/restore-sms-code-form/restore-sms-code-form.component';

export const services = {
    'user-service': UserService,
    'social-service': SocialService,
    'idle-service': IdleService,
    'terms-accept-service': TermsAcceptService,
};

export const components = {
    'wlc-accept-terms': AcceptTermsComponent,
    'wlc-add-profile-info': AddProfileInfoComponent,
    'wlc-change-password-form': ChangePasswordFormComponent,
    'wlc-exchange': ExchangeComponent,
    'wlc-icon-exp-lp': IconExpLpDescriptionComponent,
    'wlc-fundist-user-id': FundistUserIdComponent,
    'wlc-logout': LogoutComponent,
    'wlc-loyalty-block': DashboardLoyaltyBlockComponent,
    'wlc-loyalty-progress': LoyaltyProgressComponent,
    'wlc-metamask-sign-up-form': MetamaskSignUpFormComponent,
    'wlc-new-password-form': NewPasswordFormComponent,
    'wlc-profile-form': ProfileFormComponent,
    'wlc-phone-field': PhoneFieldComponent,
    'wlc-profile-blocks': ProfileBlocksComponent,
    'wlc-reality-check-info': RealityCheckInfoComponent,
    'wlc-restore-link': RestoreLinkComponent,
    'wlc-restore-password-form': RestorePasswordFormComponent,
    'wlc-sign-in-form': SignInFormComponent,
    'wlc-sign-up-form': SignUpFormComponent,
    'wlc-social-networks': SocialNetworksComponent,
    'wlc-social-sign-up-form': SocialSignUpFormComponent,
    'wlc-sms-verification': SmsVerificationComponent,
    'wlc-user-info': UserInfoComponent,
    'wlc-user-stats': UserStatsComponent,
    'wlc-user-name': UserNameComponent,
    'wlc-restore-sms-code-form': RestoreSmsCodeFormComponent,
};

@NgModule({
    declarations: [
        AcceptTermsComponent,
        AddProfileInfoComponent,
        ChangePasswordFormComponent,
        DashboardLoyaltyBlockComponent,
        ExchangeComponent,
        IconExpLpDescriptionComponent,
        FundistUserIdComponent,
        LogoutComponent,
        LoyaltyProgressComponent,
        MetamaskSignUpFormComponent,
        NewPasswordFormComponent,
        ProfileFormComponent,
        PhoneFieldComponent,
        ProfileBlocksComponent,
        RealityCheckInfoComponent,
        RestoreLinkComponent,
        RestorePasswordFormComponent,
        RestoreSmsCodeFormComponent,
        SignInFormComponent,
        SignUpFormComponent,
        SmsVerificationComponent,
        SocialNetworksComponent,
        SocialSignUpFormComponent,
        UserInfoComponent,
        UserStatsComponent,
        UserNameComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        TranslateModule,
        UIRouterModule,
    ],
    providers: [
        DataService,
        UserService,
        SocialService,
        SmsService,
        TermsAcceptService,
    ],
    exports: [
        AcceptTermsComponent,
        AddProfileInfoComponent,
        ChangePasswordFormComponent,
        DashboardLoyaltyBlockComponent,
        ExchangeComponent,
        IconExpLpDescriptionComponent,
        FundistUserIdComponent,
        LogoutComponent,
        LoyaltyProgressComponent,
        ProfileFormComponent,
        PhoneFieldComponent,
        ProfileBlocksComponent,
        RealityCheckInfoComponent,
        RestorePasswordFormComponent,
        RestoreSmsCodeFormComponent,
        SignInFormComponent,
        SignUpFormComponent,
        SmsVerificationComponent,
        SocialNetworksComponent,
        SocialSignUpFormComponent,
        UserInfoComponent,
        UserStatsComponent,
        UserNameComponent,
    ],
})
export class UserModule {
}
