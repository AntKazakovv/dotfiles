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
    baseInfo: {
        config: {
            id: 'baseInfo',
            modifier: 'info',
            modalTitle: 'Info',
            modalMessage: 'Hello! I\'m base modal window!',
            closeBtnText: 'Bye!',
            size: 'sm',
        },
    },
    search: {
        config: {
            id: 'search',
            modifier: 'search',
            modalTitle: 'Search games',
            component: SearchComponent,
            size: 'lg',
            backdrop: 'static',
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
        },
    },
};
