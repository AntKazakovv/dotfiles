import {LoaderComponent} from 'wlc-engine/modules/core/components/loader/loader.component';
import {TabSwitcherComponent} from 'wlc-engine/modules/core/components/tab-switcher/tab-switcher.component';
import {
    IModalConfig,
    IModalList,
    IModalOptions,
} from 'wlc-engine/modules/core';

import {IDepositWithdrawCParams} from 'wlc-engine/modules/finances';
import {phrases as pepPhrases} from 'wlc-engine/modules/user/submodules/pep';
import {inlinePhoneVerificationConfig as phoneVerificationConfig}
    from 'wlc-engine/modules/user/submodules/sms/components/sms-verification/sms-verification.params';

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
    loyaltyConfirmation: {
        config: {
            id: 'loyalty-confirmation',
            componentName: 'loyalty.wlc-loyalty-confirm',
            showFooter: false,
            modalTitle: gettext('Confirmation'),
        },
    },
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
            modalTitle: gettext('Let\'s play!'),
            component: TabSwitcherComponent,
            size: 'as',
            showFooter: false,
            dismissAll: true,
            componentParams: {
                tabs: {
                    'signIn': {
                        name: gettext('Login'),
                        startTab: 'signIn',
                        component: 'login.wlc-sign-in-form',
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
            componentName: 'login.wlc-sign-in-form',
            size: 'md',
            showFooter: false,
            dismissAll: true,
        },
    },
    signup: {
        config: {
            id: 'signup',
            modifier: 'login-sign-up',
            modalTitle: gettext('Let\'s play!'),
            component: TabSwitcherComponent,
            size: 'as',
            showFooter: false,
            dismissAll: true,
            withoutPadding: true,
            componentParams: {
                tabs: {
                    'signIn': {
                        name: gettext('Login'),
                        component: 'login.wlc-sign-in-form',
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
    localJackpotWon: {
        config: {
            id: 'local-jackpots-won',
            modifier: 'local-jackpots-won',
            modalTitle: gettext('Congratulations!'),
            componentName: 'local-jackpots.wlc-jackpot-won',
            size: 'md',
            showConfirmBtn: true,
            confirmBtnText: gettext('Take'),
            rejectBtnVisibility: false,
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
            componentName: 'login.wlc-restore-password-form',
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
    'password-confirmation': {
        config: {
            id: 'password-confirmation',
            modifier: 'password-confirmation',
            componentName: 'user.wlc-password-confirmation-form',
            modalTitle: gettext('Confirm password'),
            size: 'md',
            showFooter: false,
            dismissAll: true,
        },
    },
    'restore-sms-code': {
        config: {
            id: 'restore-sms-code',
            modifier: 'restore',
            componentName: 'sms.wlc-restore-sms-code-form',
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
            modalTitle: gettext('Confirmation'),
            modifier: 'logout',
            componentName: 'user.wlc-logout-confirmation',
            size: 'md',
            showFooter: false,
            dismissAll: true,
        },
    },
    runGame: {
        config: {
            id: 'play-game-for-real',
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
    achievementInfo: {
        config: {
            id: 'achievement-info',
            componentName: 'achievements.wlc-achievement-item',
            componentParams: {
                type: 'modal',
                buttonParams: {
                    Bet: {
                        theme: 'default',
                    },
                    Deposit: {
                        theme: 'default',
                    },
                    GroupWins: {
                        theme: 'default',
                    },
                    Verification: {
                        theme: 'default',
                    },
                    Win: {
                        theme: 'default',
                    },
                    Withdrawal: {
                        theme: 'default',
                    },
                    Empty: {
                        theme: 'default',
                    },
                },
            },
            showFooter: false,
        },
    },
    recommendedModal: {
        config: {
            id: 'recommended-games',
            componentName: 'games.wlc-recommended-games',
            showFooter: false,
            size: 'fluid',
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
    inaccessibleBonus: {
        config: {
            id: 'inaccessible-bonus',
            modalTitle: gettext('Information'),
            modalMessage: gettext('The selected bonus is unavailable. You can check out other bonuses'),
            textAlign: 'center',
            rejectBtnVisibility: false,
            showConfirmBtn: true,
            confirmBtnParams: {
                wlcElement: 'button__see-all-bonuses',
                common: {
                    text: gettext('See all bonuses'),
                    sref: 'app.profile.loyalty-bonuses.main',
                },
            },
            centered: true,
            size: 'md',
        },
    },
    'social-register': {
        config: {
            id: 'social-register',
            modifier: 'social-register',
            modalTitle: gettext('Registration'),
            componentName: 'signup.wlc-social-sign-up-form',
            showFooter: false,
        },
    },

    profileBlocks: {
        config: {
            id: 'profile-blocks',
            componentName: 'user.wlc-profile-blocks',
            modalTitle: gettext('Profile'),
            showFooter: false,
            size: 'md',
        },
    },
    pepInfo: {
        config: {
            id: 'pepInfo',
            modifier: 'pepInfo',
            centered: true,
            size: 'md',
            modalTitle: pepPhrases.modals.info.title,
            showFooter: false,
            componentName: 'pep.wlc-pep-info',
            ignoreBackdropClick: true,
            backdrop: 'static',
        },
    },
    pepConfirmation: {
        config: {
            id: 'pepConfirmation',
            modifier: 'pepConfirmation',
            size: 'md',
            centered: true,
            textAlign: 'center',
            modalTitle: pepPhrases.modals.confirmation.title,
            componentName: 'pep.wlc-pep-confirm-password-form',
            showFooter: false,
            useBackButton: true,
            backButtonText: pepPhrases.modals.confirmation.back,
            dismissAll: true,
            ignoreBackdropClick: true,
            backdrop: 'static',
        },
    },
    pepSaved: {
        config: {
            id: 'pepSaved',
            modifier: 'pepSaved',
            componentName: 'pep.wlc-pep-saved',
            size: 'md',
            centered: true,
            modalTitle: pepPhrases.modals.saved.title,
            showConfirmBtn: false,
            dismissAll: true,
            closeBtnParams: {
                themeMod: 'secondary',
                common: {
                    text: pepPhrases.modals.saved.close,
                    customModifiers: 'centered',
                },
            },
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
    storeConfirmation: {
        config: {
            id: 'store-confirmation',
            modifier: 'store-confirmation',
            componentName: 'store.wlc-store-confirmation',
            modalTitle: gettext('Confirmation'),
            showFooter: false,
            dismissAll: true,
        },
    },
    storeItemInfo: {
        config: {
            id: 'store-item-info',
            componentName: 'store.wlc-store-item-info',
            showFooter: false,
            dismissAll: true,
        },
    },
    deviceRegistration: {
        config: {
            id: 'device-registration',
            modifier: 'device-registration',
            componentName: 'user.wlc-device-registration-form',
            modalTitle: gettext('Login error'),
            showFooter: false,
            dismissAll: true,
            size: 'md',
        },
    },
    'two-factor-auth-info': {
        config: {
            id: 'two-factor-auth-info',
            modifier: 'two-factor-auth-info',
            componentName: 'two-factor-auth.wlc-two-factor-auth-info',
            showFooter: false,
            dismissAll: true,
            ignoreBackdropClick: true,
            backdrop: 'static',
        },
    },
    'two-factor-auth-scan': {
        config: {
            id: 'two-factor-auth-scan',
            modifier: 'two-factor-auth-scan',
            componentName: 'two-factor-auth.wlc-two-factor-auth-scan',
            showFooter: false,
            useBackButton: true,
            backButtonText: gettext('Back'),
            backButtonModal: 'two-factor-auth-info',
            dismissAll: true,
            ignoreBackdropClick: true,
            backdrop: 'static',
        },
    },
    'two-factor-auth-finish': {
        config: {
            id: 'two-factor-auth-finish',
            modifier: 'two-factor-auth-finish',
            componentName: 'two-factor-auth.wlc-two-factor-auth-finish',
            showFooter: false,
            useBackButton: true,
            backButtonText: gettext('Back'),
            backButtonModal: 'two-factor-auth-scan',
            dismissAll: true,
            ignoreBackdropClick: true,
            backdrop: 'static',
        },
    },
    'two-factor-auth-code': {
        config: {
            id: 'two-factor-auth-code',
            modifier: 'two-factor-auth-code',
            componentName: 'two-factor-auth.wlc-two-factor-auth-code',
            showFooter: false,
            dismissAll: true,
            ignoreBackdropClick: true,
            backdrop: 'static',
        },
    },
    fastDeposit: {
        config: {
            id: 'fast-deposit-modal',
            size: 'md',
            showFooter: false,
        },
    },
    nicknameIcon: {
        config: {
            id: 'nicknameIcon',
            componentName: 'user.wlc-nickname-icon-edit',
            modalTitle: gettext('Edit profile'),
            showFooter: false,
            size: 'md',
        },
    },
    depositModal: {
        config: {
            id: 'deposit-modal',
            size: 'md',
            showFooter: false,
            modalTitle: gettext('Deposit'),
            componentName: 'finances.wlc-deposit-withdraw',
            componentParams: <IDepositWithdrawCParams>{
                type: 'modal',
                mode: 'deposit',
                phoneVerifyParams: phoneVerificationConfig,
                stepsParams: {
                    paymentListParams: {
                        asModal: null,
                    },
                    bonusesListParams: {
                        type: 'swiper',
                        asModal: null,
                    },
                    paymentFormParams: {
                        themeMod: 'centered',
                        hideClearAmountButton: true,
                        paymentMessageParams: {
                            themeMod: 'modal',
                        },
                    },
                    cryptoListParams: {
                        asModal: '(min-width: 0px)',
                    },
                },
            },
        },
    },
    questTaskInfo: {
        config: {
            id: 'quest-task-item-modal',
            modifier: 'quest-task-info',
            componentName: 'quests.wlc-quests-task-item',
            componentParams: {
                theme: 'modal',
            },
            showFooter: false,
        },
    },
};
