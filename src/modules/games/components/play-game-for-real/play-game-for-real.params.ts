import _assign from 'lodash-es/assign';

import {CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';

import {
    IFormWrapperCParams,
    IInputCParams,
    IButtonCParams,
    ITextBlockCParams,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {
    defaultSignInFormParams,
    IAbstractSignInFormCParams,
} from 'wlc-engine/modules/core/system/classes/sign-in-form-abstract.class';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IPlayGameForRealCParams extends IAbstractSignInFormCParams<ComponentTheme, ComponentType, string> {
    common?: {
        customModifiers?: CustomMod;
        game?: Game,
        disableDemo?: boolean;
    };
    modifiers?: Modifiers[];
}

export const defaultParams: IPlayGameForRealCParams = _assign(
    {},
    defaultSignInFormParams,
    <IPlayGameForRealCParams>{
        class: 'wlc-play-for-real',
        moduleName: 'games',
        componentName: 'wlc-play-for-real',
    },
);

export const Events: IIndexing<string> = {
    PLAY_DEMO: 'runDemo@playGameForRealModal',
    PLAY_REAL: 'runReal@playGameForRealModal',
    SIGN_UP: 'signUp@playGameForRealModal',
};

interface IPlayForRealParams {
    game: Game,
    disableDemo: boolean;
    lang: string;
    authenticated: boolean;
    /**
     * Use field username/login
     */
    useLogin?: boolean;
    /** Hide items that are unnecessary for the kiosk */
    isKiosk?: boolean;
}

export const templateSignUp = {
    name: 'core.wlc-link-block',
    params: {
        common: {
            subtitle: gettext('Don\'t have an account?'),
            link: gettext('Sign up now'),
            actionParams: {
                event: {
                    name: Events.SIGN_UP,
                },
            },
        },
    },
};

export const playGameForRealConfig = (params: IPlayForRealParams): IFormWrapperCParams => {
    let demoBtn = [],
        orDemoBtn = [];
    if (params.game.hasDemo && !params.disableDemo) {
        demoBtn = [
            {
                name: 'core.wlc-button',
                params: <IButtonCParams>{
                    name: 'play-demo',
                    themeMod: 'secondary',
                    common: {
                        text: gettext('Demo'),
                        type: 'button',
                        typeAttr: 'button',
                        event: {
                            name: Events.PLAY_DEMO,
                        },
                    },
                },
            },
        ];
        orDemoBtn = [
            {
                name: 'core.wlc-text-block',
                params: <ITextBlockCParams>{
                    common: {
                        textBlockSubtitle: gettext('or'),
                    },
                },
            },
            ...demoBtn,
        ];
    }

    const generateConfigForNotAuthenticated = (params: IPlayForRealParams): IFormComponent[] => {
        return [
            {
                name: 'core.wlc-text-block',
                params: <ITextBlockCParams>{
                    common: {
                        textBlockTitle: params.game.name['en'],
                        textBlockSubtitle: gettext('Login to play for real'),
                    },
                },
            },
            params.useLogin ? FormElements.loginEmail : {
                name: 'core.wlc-input',
                params: <IInputCParams>{
                    theme: GlobalHelper.isMobileApp() ? 'mobile-app' : 'vertical',
                    common: {
                        placeholder: gettext('E-mail'),
                        type: 'email',
                    },
                    name: 'email',
                    validators: ['required', 'email'],
                },
            },
            {
                name: 'core.wlc-input',
                params: <IInputCParams>{
                    theme: GlobalHelper.isMobileApp() ? 'mobile-app' : 'vertical',
                    common: {
                        placeholder: gettext('Password'),
                        type: 'password',
                        customModifiers: 'right-shift',
                        usePasswordVisibilityBtn: true,
                        fixAutoCompleteForm: false,
                    },
                    name: 'password',
                    validators: ['required', 'password', 'passwordLength'],
                },
            },
            !params.isKiosk ? {
                name: 'user.wlc-restore-link',
                params: {
                    common: {
                        typeAttr: 'button',
                    },
                },
            } : null,
            {
                name: 'user.wlc-pseudo-link',
                params: {},
            },
            {
                name: 'core.wlc-button',
                params: <IButtonCParams>{
                    themeMod: 'secondary',
                    common: {
                        text: gettext('Login'),
                        type: 'submit',
                        typeAttr: 'submit',
                    },
                },
            },
            ...orDemoBtn,
            !params.isKiosk ? templateSignUp : null,
        ];
    };

    const forNotAuthenticated = generateConfigForNotAuthenticated(params);

    const forAuthenticated = [
        {
            name: 'games.wlc-game-thumb',
            params: {
                type: 'modal',
                common: {
                    game: params.game,
                },
            },
        },
        {
            name: 'core.wlc-text-block',
            params: <ITextBlockCParams>{
                common: {
                    themeMod: 'game-title',
                    textBlockSubtitle: params.game.name['en'],
                },
            },
        },
        {
            name: 'core.wlc-button',
            params: <IButtonCParams>{
                name: 'play-real',
                common: {
                    text: gettext('Play'),
                    type: 'button',
                    typeAttr: 'button',
                    event: {
                        name: Events.PLAY_REAL,
                    },
                },
            },
        },
        ...demoBtn,
    ];

    return {
        class: 'wlc-form-wrapper',
        components: params.authenticated ? forAuthenticated : forNotAuthenticated,
    };
};
