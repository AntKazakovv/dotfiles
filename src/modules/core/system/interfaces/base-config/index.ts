import {IDeviceConfig} from 'wlc-engine/modules/core/system/models/device.model';
import {IGamesConfig} from './games.interface';
import {IProfileConfig} from './profile.interface';
import {ITournamentsConfig} from './tournaments.interface';
import {IAppConfig} from './app.interface';
import {INotificationsConfig} from './notifications.interface';
import {IContactsConfig} from './contacts.interface';
import {IInteractiveText} from './interactiveText.interface';
import {ILivechatConfig} from 'wlc-engine/modules/livechat';
import {IAutoMockConfig} from 'wlc-engine/mocks/browser';
import {
    IIndexing,
    IRedirectConfig,
} from 'wlc-engine/modules/core';
import {IRegistrationConfig} from './registration.interface';
import {IAnalytics} from 'wlc-engine/modules/analytics/system/interfaces/analytics.interface';
import {IColorThemeSwitchingConfig} from './color-theme-switching.config';
import {IFinancesConfig} from './finances.interface';
import {IStickyHeaderConfig} from './sticky-header.interface';
import {IFixedPanelConfig} from './fixed-panel.interface';
import {IMocksConfig} from './mocks.interface';
import {IMonitoringConfig} from './monitoring.interface';
import {IIdleConfig} from './idle.interface';
import {IRestrictionsConfig} from './restrictions.interface';
import {ILegalCheckboxWithLink} from 'wlc-engine/modules/core/components/checkbox/checkbox.params';

export * from './games.interface';
export * from './tournaments.interface';
export * from './finances.interface';
export * from './contacts.interface';
export * from './profile.interface';
export * from './idle.interface';

export interface IBaseConfig {
    app?: IAppConfig;
    site?: {
        name: string;
        url: string;
        removeCreds?: boolean;
        restrictRegistration?: boolean;
        /**
         * Use field username/login
         */
        useLogin?: boolean;
        /**
        * Link to the main landing page of the affiliate program.
        * Uses for action 'AFFILIATE_REDIRECT'.
        */
        landingUrl?: string,
        /** Force use Curacao requirements as for WLC */
        forceCuracaoRequirement?: boolean;
        /** Use x-nonce on requests */
        useXNonce?: boolean;
    };
    /**
    * Sticky header enabling and settings;
    */
    stickyHeader?: IStickyHeaderConfig;
    fixedPanel?: IFixedPanelConfig;
    affiliate?: {
        affiliateUrl: string;
        siteUrl: string;
        useTestimonials?: boolean;
    };
    /* Used to allow starting in iframe from special domains, eg metrika.yandex.ru */
    allowedIframeReferrers?: string[];
    profile?: IProfileConfig;
    tournaments?: ITournamentsConfig;
    games?: IGamesConfig;
    device?: IDeviceConfig;
    notifications?: INotificationsConfig;
    contacts?: IContactsConfig;
    interactiveText?: IInteractiveText[];
    livechat?: ILivechatConfig;
    /**
     * Config redirection by event or state
     */
    redirects?: IRedirectConfig;
    /**
     * Use seo service; Service gets information from wordpress plugin 'Seo Softgamings';
     */
    useSeo?: boolean;
    /**
     * Config of web analytics systems
     */
    analytics?: IAnalytics;
    colorThemeSwitching?: IColorThemeSwitchingConfig;
    registration?: IRegistrationConfig;
    finances?: IFinancesConfig;
    /**
     * if true - аfter registering, the notifications will be automatically turned on
     */
    turnOnSendEmailNotificationInRegister?: boolean;
    /**
     * add ability to change wp language code
     */
    rewritingWpLanguages?: IIndexing<string>;
    /**
     * Use mocks in project, makes sense for development mode only
     */
    mocks?: IMocksConfig;

    /**
     * Auto generated mocks
     */
    autoMocks?: IAutoMockConfig;

    /**
     * Config for monitoring system
     */
    monitoring?: IMonitoringConfig;
    /**
     * Settings for logout when idle
     */
    idle?: IIdleConfig;
    /**
     * Config default currency
     */
    defaultCurrency?: string;
    /**
     * Change currency name. It will be shown in select
     */
    rewritingCurrencyName?: IIndexing<string>;
    /**
     * Settings for any constraints
     */
    restrictions?: IRestrictionsConfig;
    /** States available with no accepted terms */
    termsAvailableStates?: string[];
    forms?: {
        /** Set true to use submit button pending animation */
        useSubmitButtonPending?: boolean
    }
    legal?: {
        termsCheckboxText?: ILegalCheckboxWithLink;
        termsWlcCuracaoCheckboxText?: ILegalCheckboxWithLink;
        ageCheckboxText?: string;
        ageWlcCuracaoCheckboxText?: string;
        selfExcludedCheckboxText?: string;
        paymentRulesText?: ILegalCheckboxWithLink,
        privacyPolicyText?: ILegalCheckboxWithLink,
    }
    /**
     * Kiosk settings
     */
    kiosk?: {
        /** dont use signin state */
        hideSigninState?: boolean;
    },
}
