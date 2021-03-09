import {ChangePasswordFormComponent} from 'wlc-engine/modules/user/components/change-password-form/change-password-form.component';
import {LoaderComponent} from 'wlc-engine/modules/core/components/loader/loader.component';
import {LogoutComponent} from 'wlc-engine/modules/user/components/logout/logout.component';
import {NewPasswordFormComponent} from 'wlc-engine/modules/user/components/new-password-form/new-password-form.component';
import {PlayGameForRealComponent} from 'wlc-engine/modules/games/components/play-game-for-real/play-game-for-real.component';
import {PostComponent} from 'wlc-engine/modules/static/components/post/post.component';
import {PromoSuccessComponent} from 'wlc-engine/modules/bonuses/components/promo-success/promo-success.component';
import {RestorePasswordFormComponent} from 'wlc-engine/modules/user/components/restore-password-form/restore-password-form.component';
import {SearchComponent} from 'wlc-engine/modules/games/components/search/search.component';
import {
    IModalConfig,
    IModalList,
    IModalOptions,
} from './index';
import {TabSwitcherComponent} from 'wlc-engine/modules/core/components/tab-switcher/tab-switcher.component';

export const defaultParams: IModalOptions = {
    moduleName: 'core',
    componentName: 'wlc-modal-window',
    class: 'wlc-modal',
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
    textAlign: 'left',
    withoutPadding: false,
};

export const MODALS_LIST: IModalList = {
    search: {
        config: {
            id: 'search',
            modifier: 'search',
            component: SearchComponent,
            showFooter: false,
        },
    },
    login: {
        config: {
            id: 'login',
            modifier: 'login-sign-up',
            modalTitle: gettext('Sign in now!'),
            component: TabSwitcherComponent,
            size: 'as',
            showFooter: false,
            dismissAll: true,
            componentParams: {
                tabs: {
                    'signIn': {
                        name: gettext('Sign in'),
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
                        name: gettext('Sign in'),
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
            component: ChangePasswordFormComponent,
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
            component: NewPasswordFormComponent,
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
            component: RestorePasswordFormComponent,
            componentParams: {
                wlcElement: 'form_password-recovery',
            },
            modalTitle: gettext('Password restore'),
            size: 'md',
            showFooter: false,
            dismissAll: true,
            useBackButton: true,
            backButtonText: gettext('Back'),
        },
    },
    logout: {
        config: {
            id: 'logout',
            modalTitle: 'Log out',
            modifier: 'logout',
            component: LogoutComponent,
            size: 'md',
            dismissAll: true,
        },
    },
    runGame: {
        config: {
            id: 'play-game-for-real',
            modifier: 'play-game-for-real',
            component: PlayGameForRealComponent,
            componentParams: {
                common: {
                    game: null,
                    disableDemo: false,
                },
            },
            size: 'md',
            showFooter: false,
            modalTitle: gettext('Lets play!'),
        },
    },
    staticText: {
        config: {
            id: 'static-text',
            modifier: 'static-text',
            component: PostComponent,
            size: 'lg',
            scrollable: true,
        },
    },
    registrationSuccess: {
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
            component: PromoSuccessComponent,
            size: 'md',
            backdrop: 'static',
            showFooter: false,
            dismissAll: true,
        },
    },
    dataIsProcessing: {
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
};
