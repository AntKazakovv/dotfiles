import {SearchComponent} from 'wlc-engine/modules/games/components/search/search.component';
import {SignInFormComponent} from 'wlc-engine/modules/user/components/sign-in-form/sign-in-form.component';
import {SignUpComponent} from 'wlc-engine/modules/user/components/sign-up/sign-up.component';
import {ChangePasswordFormComponent} from 'wlc-engine/modules/user/components/change-password-form/change-password-form.component';
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
    dismissAll: true,
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
    //TODO refactor after engine release 13.11.2020
    login: {
        config: {
            id: 'login',
            modifier: 'login',
            modalTitle: 'Login',
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
            modalTitle: 'Signup',
            component: SignUpComponent,
            size: 'md',
            backdrop: 'static',
            showFooter: false,
        },
    },
    changePassword: {
        config: {
            id: 'change-password',
            modifier: 'change-password',
            modalTitle: 'Change password',
            component: ChangePasswordFormComponent,
            size: 'md',
            backdrop: 'static',
        },
    },
    restorePassword: {
        config: {
            id: 'restore-password',
            modifier: 'restore-password',
            modalTitle: 'Password restore',
            component: RestorePasswordFormComponent,
            size: 'md',
            backdrop: 'static',
        },
    },
};
