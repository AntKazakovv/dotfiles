import {NgModule} from '@angular/core';
import {UIRouterModule} from '@uirouter/angular';
import {
    DataService,
} from 'wlc-engine/modules/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {
    UserService,
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
import {EmailFieldComponent} from './components/email-field/email-field.component';
import {ExchangeComponent} from './components/dashboard-exchange/exchange.component';
import {FundistUserIdComponent} from './components/fundist-id/fundist-user-id.component';
import {IconExpLpDescriptionComponent} from './components/icon-exp-lp-description/icon-exp-lp-description.component';
import {LogoutComponent} from './components/logout/logout.component';
import {LoyaltyProgressComponent} from './components/loyalty-progress/loyalty-progress.component';
import {NewPasswordFormComponent} from './components/new-password-form/new-password-form.component';
import {ProfileFormComponent} from './components/profile-form/profile-form.component';
import {ProfileBlocksComponent} from './components/profile-blocks/profile-blocks.component';
import {
    RealityCheckInfoComponent,
} from 'wlc-engine/modules/user/components/reality-check-info/reality-check-info.component';
import {UserIconComponent} from './components/user-icon/user-icon.component';
import {UserInfoComponent} from './components/user-info/user-info.component';
import {UserStatsComponent} from './components/user-stats/user-stats.component';
import {UserNameComponent} from './components/user-name/user-name.component';
import {SocialNetworksComponent} from './components/social-networks/social-networks.component';

import {
    EmailVerificationNotificationComponent,
} from './components/email-verification-notification/email-verification-notification.component';

import {
    DeviceRegistrationFormComponent,
} from 'wlc-engine/modules/user/components/device-registration-form/device-registration-form.component';
import {
    PasswordConfirmationFormComponent,
} from 'wlc-engine/modules/user/components/password-confirmation-form/password-confirmation-form.component';
import {MultiWalletModule} from 'wlc-engine/modules/multi-wallet/multi-wallet.module';
import {
    LogoutConfirmationComponent,
} from 'wlc-engine/modules/user/components/logout-confirmation/logout-confirmation.component';
import {
    AutoLogoutProfileBlockComponent,
} from 'wlc-engine/modules/user/components/auto-logout-profile-block/auto-logout-profile-block.component';
import {NicknameIconComponent} from 'wlc-engine/modules/user/components/nickname-icon/nickname-icon.component';
import {
    NicknameIconEditComponent,
} from 'wlc-engine/modules/user/components/nickname-icon-edit/nickname-icon-edit.component';
import {
    EndedSessionModalComponent,
} from 'wlc-engine/modules/user/components/ended-session-modal/ended-session-modal.component';
import {
    NotificationSettingsComponent,
} from 'wlc-engine/modules/user/components/notification-settings/notification-settings.component';
import {
    SubscriptionsModalComponent,
} from 'wlc-engine/modules/user/components/subscriptions-modal/subscriptions-modal.component';

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
    'wlc-device-registration-form': DeviceRegistrationFormComponent,
    'wlc-email-field': EmailFieldComponent,
    'wlc-exchange': ExchangeComponent,
    'wlc-icon-exp-lp': IconExpLpDescriptionComponent,
    'wlc-fundist-user-id': FundistUserIdComponent,
    'wlc-logout': LogoutComponent,
    'wlc-loyalty-block': DashboardLoyaltyBlockComponent,
    'wlc-loyalty-progress': LoyaltyProgressComponent,
    'wlc-new-password-form': NewPasswordFormComponent,
    'wlc-password-confirmation-form': PasswordConfirmationFormComponent,
    'wlc-profile-blocks': ProfileBlocksComponent,
    'wlc-profile-form': ProfileFormComponent,
    'wlc-reality-check-info': RealityCheckInfoComponent,
    'wlc-social-networks': SocialNetworksComponent,
    'wlc-user-icon': UserIconComponent,
    'wlc-user-info': UserInfoComponent,
    'wlc-user-name': UserNameComponent,
    'wlc-user-stats': UserStatsComponent,
    'wlc-email-verification-notification': EmailVerificationNotificationComponent,
    'wlc-logout-confirmation': LogoutConfirmationComponent,
    'wlc-auto-logout-profile-block': AutoLogoutProfileBlockComponent,
    'wlc-nickname-icon': NicknameIconComponent,
    'wlc-nickname-icon-edit': NicknameIconEditComponent,
    'wlc-ended-session-modal': EndedSessionModalComponent,
    'wlc-notification-settings': NotificationSettingsComponent,
    'wlc-subscriptions-modal': SubscriptionsModalComponent,
};

@NgModule({
    declarations: [
        AcceptTermsComponent,
        AddProfileInfoComponent,
        ChangePasswordFormComponent,
        DashboardLoyaltyBlockComponent,
        DeviceRegistrationFormComponent,
        EmailFieldComponent,
        ExchangeComponent,
        IconExpLpDescriptionComponent,
        FundistUserIdComponent,
        LogoutComponent,
        LoyaltyProgressComponent,
        NewPasswordFormComponent,
        PasswordConfirmationFormComponent,
        ProfileFormComponent,
        ProfileFormComponent,
        ProfileBlocksComponent,
        RealityCheckInfoComponent,
        SocialNetworksComponent,
        UserIconComponent,
        UserInfoComponent,
        UserNameComponent,
        UserStatsComponent,
        EmailVerificationNotificationComponent,
        LogoutConfirmationComponent,
        AutoLogoutProfileBlockComponent,
        NicknameIconComponent,
        NicknameIconEditComponent,
        EndedSessionModalComponent,
        NotificationSettingsComponent,
        SubscriptionsModalComponent,
    ],
    imports: [
        CoreModule,
        UIRouterModule,
        MultiWalletModule,
    ],
    providers: [
        DataService,
        UserService,
        SocialService,
        TermsAcceptService,
    ],
    exports: [
        AcceptTermsComponent,
        AddProfileInfoComponent,
        ChangePasswordFormComponent,
        DashboardLoyaltyBlockComponent,
        DeviceRegistrationFormComponent,
        EmailFieldComponent,
        ExchangeComponent,
        IconExpLpDescriptionComponent,
        FundistUserIdComponent,
        LogoutComponent,
        LoyaltyProgressComponent,
        ProfileFormComponent,
        ProfileBlocksComponent,
        RealityCheckInfoComponent,
        SocialNetworksComponent,
        UserIconComponent,
        UserInfoComponent,
        UserNameComponent,
        UserStatsComponent,
        EmailVerificationNotificationComponent,
        LogoutConfirmationComponent,
        AutoLogoutProfileBlockComponent,
        NicknameIconComponent,
        NicknameIconEditComponent,
        EndedSessionModalComponent,
        NotificationSettingsComponent,
        SubscriptionsModalComponent,
    ],
})
export class UserModule {
}
