import _assign from 'lodash-es/assign';

import {CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {IBetInfoCParams} from 'wlc-engine/modules/promo/components/bet-info/bet-info.params';

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
import {IChoiceCurrencyParams} from 'wlc-engine/modules/multi-wallet/components/choice-currency/choice-currency.params';

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
        showPplInfo?: boolean;
        latestBetsWidgetParams?: ILatestBetWidget;
        isLatestBetsWidget?: boolean;
        gameThumbThemeMod?: string;
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

const insertPplInfo = (game: Game, themeMod: string): IFormComponent => {

    return {
        name: 'games.wlc-game-thumb',
        params: {
            themeMod: themeMod,
            type: 'ppl-info',
            common: {
                game: game,
            },
        },
    };
};

interface ILatestBetWidget {
    currency?: string,
    amount?: string,
    coefficient?: string,
    profit?: string,
    isWin?: boolean,
}

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
    showPplInfo?: boolean;
    /**Hide items Bet-info in modal */
    latestBetsWidgetParams?: ILatestBetWidget;
    isLatestBetsWidget?: boolean;
    gameThumbThemeMod?: string;
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
            name: 'core.wlc-text-block',
            params: <ITextBlockCParams>{
                common: {
                    themeMod: 'game-title',
                    textBlockSubtitle: params.game.name['en'],
                },
            },
        },
        {
            name: 'games.wlc-game-thumb',
            params: {
                type: 'modal',
                themeMod: 'default',
                common: {
                    game: params.game,
                },
            },
        },
        params.game.currencyNotSupported ? {
            name: 'multi-wallet.wlc-choice-currency',
            params: <IChoiceCurrencyParams>{
                game: params.game,
                themeMod: 'in-modal',
            },
        } : null,
        params.isLatestBetsWidget ? {
            name: 'promo.wlc-bet-info',
            params: <IBetInfoCParams>{
                class: 'wlc-bet-info',
                betInfo: {
                    currency: params.latestBetsWidgetParams.currency,
                    amount: params.latestBetsWidgetParams.amount,
                    profit: params.latestBetsWidgetParams.profit,
                    coefficient: params.latestBetsWidgetParams.coefficient,
                    isWin: params.latestBetsWidgetParams.isWin,
                },
            },
        } : null,
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
        params.showPplInfo ? insertPplInfo(params.game, params.gameThumbThemeMod) : null,
    ];

    return {
        class: 'wlc-form-wrapper',
        components: params.authenticated ? forAuthenticated : forNotAuthenticated,
    };
};
