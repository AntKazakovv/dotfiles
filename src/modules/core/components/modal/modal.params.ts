import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {LoaderComponent} from 'wlc-engine/modules/core/components/loader/loader.component';
import {TabSwitcherComponent} from 'wlc-engine/modules/core/components/tab-switcher/tab-switcher.component';
import {
    IModalConfig,
    IModalList,
    IModalOptions,
    IRestrictModalOption,
} from './index';

export const defaultParams: IModalOptions = {
    moduleName: 'core',
    componentName: 'wlc-modal-window',
    class: 'wlc-modal',
    ignoreBackdropClickBreakpoint: '(max-width: 559px)',
};

export const DEFAULT_MODAL_CONFIG: Partial<IModalConfig> = {
    show: true,
    keyboard: true,
    backdrop: true,
    focus: true,
    animation: true,
    dismissAll: false,
    showFooter: true,
    size: 'md',
    useBackButton: false,
    backButtonText: '',
    closeBtnVisibility: true,
    rejectBtnVisibility: true,
    textAlign: 'left',
    withoutPadding: false,
};

export const MODALS_LIST: IModalList = {
    search: {
        config: {
            id: 'search',
            modifier: 'search',
            componentName: 'games.wlc-search',
            showFooter: false,
        },
    },
    searchWithOpenedProviders: {
        config: {
            id: 'search',
            modifier: 'search',
            componentName: 'games.wlc-search',
            componentParams: {
                common: {
                    openProvidersList: true,
                },
            },
            showFooter: false,
        },
    },
    login: {
        config: {
            id: 'login',
            modifier: 'login-sign-up',
            modalTitle: gettext('Login now!'),
            component: TabSwitcherComponent,
            size: 'as',
            showFooter: false,
            dismissAll: true,
            componentParams: {
                tabs: {
                    'signIn': {
                        name: gettext('Login'),
                        startTab: 'signIn',
                        component: 'user.wlc-sign-in-form',
                        modifier: 'login',
                        modalId: 'login',
                    },
                    'signUp': {
                        name: gettext('Sign up'),
                        component: 'core.wlc-steps',
                        theme: 'signInUp',
                        modifier: 'signup',
                        modalId: 'signup',
                    },
                },
            },
        },
    },
    kioskLogin: {
        config: {
            id: 'login',
            componentName: 'user.wlc-sign-in-form',
            size: 'md',
            showFooter: false,
            dismissAll: true,
        },
    },
    signup: {
        config: {
            id: 'signup',
            modifier: 'login-sign-up',
            modalTitle: gettext('Sign up now!'),
            component: TabSwitcherComponent,
            size: 'as',
            showFooter: false,
            dismissAll: true,
            withoutPadding: true,
            componentParams: {
                tabs: {
                    'signIn': {
                        name: gettext('Login'),
                        component: 'user.wlc-sign-in-form',
                        modifier: 'login',
                        modalId: 'login',
                    },
                    'signUp': {
                        name: gettext('Sign up'),
                        startTab: 'signUp',
                        component: 'core.wlc-steps',
                        modifier: 'signup',
                        modalId: 'signup',
                    },
                },
            },
        },
    },
    changePassword: {
        config: {
            id: 'change-password',
            modifier: 'change-password',
            componentName: 'user.wlc-change-password-form',
            componentParams: {
                wlcElement: 'wlc-profile-edit__password',
            },
            size: 'md',
            showFooter: false,
            dismissAll: true,
        },
    },
    newPassword: {
        config: {
            id: 'new-password',
            modifier: 'new-password',
            componentName: 'user.wlc-new-password-form',
            componentParams: {
                wlcElement: 'form_forgot-password',
            },
            size: 'md',
            showFooter: false,
            dismissAll: true,
            modalTitle: gettext('Create a new password'),
        },
    },
    restorePassword: {
        config: {
            id: 'restore-password',
            modifier: 'restore',
            componentName: 'user.wlc-restore-password-form',
            componentParams: {
                wlcElement: 'form_password-recovery',
            },
            modalTitle: gettext('Password restore'),
            size: 'md',
            showFooter: false,
            dismissAll: true,
            useBackButton: true,
            backButtonText: gettext('Back'),
            backButtonModal: 'login',
        },
    },
    'restore-sms-code': {
        config: {
            id: 'restore-sms-code',
            modifier: 'restore',
            componentName: 'user.wlc-restore-sms-code-form',
            componentParams: {
                wlcElement: 'form_password-recovery',
            },
            modalTitle: gettext('Password restore'),
            size: 'md',
            showFooter: false,
            dismissAll: true,
            useBackButton: true,
            backButtonText: gettext('Back'),
            backButtonModal: 'restorePassword',
        },
    },
    logout: {
        config: {
            id: 'logout',
            modalTitle: 'Log out',
            modifier: 'logout',
            componentName: 'user.wlc-logout',
            size: 'md',
            dismissAll: true,
        },
    },
    runGame: {
        config: {
            id: 'play-game-for-real',
            modalTitle: gettext('Let\'s play!'),
            modifier: 'play-game-for-real',
            componentName: 'games.wlc-play-game-for-real',
            componentParams: {
                common: {
                    game: null,
                    disableDemo: false,
                },
            },
            size: 'md',
            showFooter: false,
        },
    },
    gamesSlider: {
        config: {
            id: 'games-slider',
            modifier: 'games-slider',
            componentName: 'games.wlc-games-slider',
            componentParams: {
                isModal: true,
            },
            rejectBtnVisibility: false,
            size: 'xl',
            showFooter: false,
        },
    },
    staticText: {
        config: {
            id: 'static-text',
            modifier: 'static-text',
            componentName: 'static.wlc-post',
            size: 'lg',
            scrollable: true,
        },
    },
    'registration-success': {
        config: {
            id: 'registration-success',
            modifier: 'registration-success',
            component: LoaderComponent,
            size: 'md',
            backdrop: 'static',
            closeBtnVisibility: false,
            showFooter: false,
            modalMessage: gettext('Registration completed. Wait for authorization'),
            textAlign: 'center',
        },
    },
    promoSuccess: {
        config: {
            id: 'promo-success',
            modifier: 'restore-password',
            componentName: 'bonuses.wlc-promo-success',
            size: 'md',
            backdrop: 'static',
            showFooter: false,
            dismissAll: true,
        },
    },
    'data-is-processing': {
        config: {
            id: 'data-is-processing',
            modifier: 'data-is-processing',
            component: LoaderComponent,
            size: 'md',
            backdrop: 'static',
            closeBtnVisibility: false,
            showFooter: false,
            modalMessage: gettext('Please, wait. Data processing in progress...'),
            textAlign: 'center',
        },
    },
    descriptionCasinosCurrency: {
        config: {
            id: 'descriptionCasinosCurrency',
            modalTitle: gettext('Loyalty Program'),
            closeBtnVisibility: true,
            componentName: 'user.wlc-icon-exp-lp',
        },
    },
    loyaltyInfo: {
        config: {
            id: 'loyalty-info',
            modifier: 'loyalty-info-modal',
            componentName: 'loyalty.wlc-loyalty-info',
            size: 'lg',
            backdrop: true,
            dismissAll: true,
            closeBtnParams: {
                themeMod: 'secondary',
                common: {
                    text: gettext('Close'),
                },
            },
        },
    },
    bonusModal: {
        config: {
            id: 'bonus-modal',
            componentName: 'bonuses.wlc-bonus-modal',
            showFooter: false,
            size: 'lg',
        },
    },
    'social-register': {
        config: {
            id: 'social-register',
            modifier: 'social-register',
            modalTitle: gettext('Registration'),
            componentName: 'user.wlc-social-sign-up-form',
            showFooter: false,
        },
    },
    profileBlocks: {
        config: {
            id: 'profile-blocks',
            componentName: 'user.wlc-profile-blocks',
            modalTitle: gettext('User Settings'),
            showFooter: false,
            size: 'md',
        },
    },
    lootbox: {
        config: {
            id: 'lootbox',
            componentName: 'bonuses.wlc-lootbox-modal',
            showFooter: false,
            size: 'md',
            dismissAll: true,
        },
    },
    storeItemInfo: {
        config: {
            id: 'store-item-info',
            componentName: 'store.wlc-store-item-info',
            showFooter: true,
            dismissAll: true,
        },
    },
};

export const RESTRICT_MODAL: IIndexing<IRestrictModalOption> = {
    'signup': {
        baseConfigKey: '$base.site.restrictRegistration',
        baseConfigValue: true,
        message: gettext('Sorry, registration is disabled.'),
        wlcElement: 'registration-is-disabled',
    },
};
