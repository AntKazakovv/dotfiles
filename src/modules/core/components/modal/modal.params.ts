import {SearchComponent} from 'wlc-engine/modules/games/components/search/search.component';
import {SignUpFormComponent} from 'wlc-engine/modules/user/components/sign-up-form/sign-up-form.component';
import {SignInFormComponent} from 'wlc-engine/modules/user/components/sign-in-form/sign-in-form.component';
import {ChangePasswordFormComponent} from 'wlc-engine/modules/user/components/change-password-form/change-password-form.component';
import {RestorePasswordFormComponent} from 'wlc-engine/modules/user/components/restore-password-form/restore-password-form.component';
import {LogoutComponent} from 'wlc-engine/modules/user/components/logout/logout.component';
import {
    IModalConfig,
    IModalList,
    IModalOptions,
} from './index';
import {PlayGameForRealComponent} from 'wlc-engine/modules/games/components/play-game-for-real/play-game-for-real.component';

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
};

export const MODALS_LIST: IModalList = {
    search: {
        config: {
            id: 'search',
            modifier: 'search',
            component: SearchComponent,
            backdrop: 'static',
            showFooter: false,
        },
    },
    login: {
        config: {
            id: 'login',
            modifier: 'login',
            component: SignInFormComponent,
            size: 'md',
            backdrop: 'static',
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
            backdrop: 'static',
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
            backdrop: 'static',
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
            backdrop: 'static',
            showFooter: false,
            dismissAll: true,
        },
    },
    logout: {
        config: {
            id: 'logout',
            modalTitle: 'Log out',
            modifier: 'logout',
            component: LogoutComponent,
            size: 'md',
            backdrop: 'static',
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
            backdrop: 'static',
            showFooter: false,
        }
    }
};
