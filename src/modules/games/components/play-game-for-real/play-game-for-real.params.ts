import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';

import {
    IFormWrapperCParams,
    IInputCParams,
    IButtonCParams,
    ITextBlockCParams,
} from 'wlc-engine/modules/core';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface IPlayGameForRealCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    common?: {
        customModifiers?: CustomMod;
        game?: Game,
        disableDemo?: boolean;
    };
    modifiers?: Modifiers[];
}

export const defaultParams: IPlayGameForRealCParams = {
    class: 'wlc-play-for-real',
};

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
}

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

    const forNotAuthenticated = [
        {
            name: 'core.wlc-text-block',
            params: <ITextBlockCParams>{
                common: {
                    textBlockTitle: params.game.name['en'],
                    textBlockSubtitle: gettext('Sign in to play for real'),
                },
            },
        },
        {
            name: 'core.wlc-input',
            params: <IInputCParams>{
                theme: 'vertical',
                common: {
                    placeholder: gettext('Email'),
                    type: 'email',
                },
                name: 'email',
                validators: ['required', 'email'],
            },
        },
        {
            name: 'core.wlc-input',
            params: <IInputCParams>{
                theme: 'vertical',
                common: {
                    placeholder: gettext('Password'),
                    type: 'password',
                    customModifiers: 'right-shift',
                    usePasswordVisibilityBtn: true,
                },
                name: 'password',
                validators: ['required', 'password',
                    {
                        name: 'minLength',
                        options: 6,
                    },
                ],
            },
        },
        {
            name: 'user.wlc-restore-link',
            params: {
                common: {
                    typeAttr: 'button',
                },
            },
        },
        {
            name: 'user.wlc-pseudo-link',
            params: {},
        },
        {
            name: 'core.wlc-button',
            params: <IButtonCParams>{
                name: 'submit',
                themeMod: 'secondary',
                common: {
                    text: gettext('Sign in'),
                    type: 'submit',
                },
            },
        },
        ...orDemoBtn,
        {
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
        },
    ];

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
                themeMod: 'game-title',
                common: {
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
