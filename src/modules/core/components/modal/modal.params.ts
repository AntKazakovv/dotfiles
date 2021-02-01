import {ChangePasswordFormComponent} from 'wlc-engine/modules/user/components/change-password-form/change-password-form.component';
import {LoaderComponent} from 'wlc-engine/modules/core/components/loader/loader.component';
import {LogoutComponent} from 'wlc-engine/modules/user/components/logout/logout.component';
import {NewPasswordFormComponent} from 'wlc-engine/modules/user/components/new-password-form/new-password-form.component';
import {PlayGameForRealComponent} from 'wlc-engine/modules/games/components/play-game-for-real/play-game-for-real.component';
import {PostComponent} from 'wlc-engine/modules/static/components/post/post.component';
import {PromoSuccessComponent} from 'wlc-engine/modules/bonuses/components/promo-success/promo-success.component';
import {RestorePasswordFormComponent} from 'wlc-engine/modules/user/components/restore-password-form/restore-password-form.component';
import {SearchComponent} from 'wlc-engine/modules/games/components/search/search.component';
import {SignUpFormComponent} from 'wlc-engine/modules/user/components/sign-up-form/sign-up-form.component';
import {SignInFormComponent} from 'wlc-engine/modules/user/components/sign-in-form/sign-in-form.component';
import {ChangePasswordFormComponent} from 'wlc-engine/modules/user/components/change-password-form/change-password-form.component';
import {NewPasswordFormComponent} from 'wlc-engine/modules/user/components/new-password-form/new-password-form.component';
import {RestorePasswordFormComponent} from 'wlc-engine/modules/user/components/restore-password-form/restore-password-form.component';
import {
    IModalConfig,
    IModalList,
    IModalOptions,
} from './index';

export const defaultParams: IModalOptions = {
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
    backButtonText: 'back',
    closeBtnVisibility: true,
    textAlign: 'left',
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
            modifier: 'login',
            component: SignInFormComponent,
            size: 'md',
            showFooter: false,
            dismissAll: true,
        },
    },
    signup: {
        config: {
            id: 'signup',
            modifier: 'signup',
            component: SignUpFormComponent,
            size: 'md',
            showFooter: false,
            dismissAll: true,
        },
    },
    changePassword: {
        config: {
            id: 'change-password',
            modifier: 'change-password',
            component: ChangePasswordFormComponent,
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
            size: 'md',
            showFooter: false,
            dismissAll: true,
        },
    },
    restorePassword: {
        config: {
            id: 'restore-password',
            modifier: 'restore-password',
            component: RestorePasswordFormComponent,
            size: 'md',
            showFooter: false,
            dismissAll: true,
            useBackButton: true,
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
        },
    },
    staticText: {
        config: {
            id: 'static-text',
            modifier: 'static-text',
            component: PostComponent,
            size: 'lg',
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
};
