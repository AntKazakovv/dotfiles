import {SearchComponent} from 'wlc-engine/modules/games/components/search/search.component';
import {SignInComponent} from 'wlc-engine/modules/user/components/sign-in/sign-in.component';
import {SignUpComponent} from 'wlc-engine/modules/user/components/sign-up/sign-up.component';
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
            component: SignInComponent,
            size: 'md',
            backdrop: 'static',
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
        },
    },
};
