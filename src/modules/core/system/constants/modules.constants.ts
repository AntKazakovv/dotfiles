import {Type} from '@angular/core';

export type TModuleName =
    | 'core'
    | 'affiliates'
    | 'menu'
    | 'games'
    | 'icon-list'
    | 'static'
    | 'promo'
    | 'user'
    | 'pep'
    | 'sms'
    | 'finances'
    | 'forms'
    | 'extra-forms'
    | 'transfer'
    | 'bonuses'
    | 'store'
    | 'tournaments'
    | 'profile'
    | 'sportsbook'
    | 'livechat'
    | 'compiler'
    | 'custom'
    | 'analytics'
    | 'monitoring'
    | 'internal-mails'
    | 'lotteries'
    | 'loyalty'
    | 'achievements'
    | 'quests'
    | 'metamask'
    | 'history'
    | 'deadsimplechat'
    | 'limitations'
    | 'chat'
    | 'captcha'
    | 'rates'
    | 'recaptcha'
    | 'cashback'
    | 'external-services'
    | 'gambling-ban'
    | 'seo'
    | 'aml'
    | 'wheel'
    | 'multi-wallet'
    | 'two-factor-auth'
    | 'signup'
    | 'login'
    | 'currency'
    | 'qr-code'
    | 'pwa'
    | 'local-jackpots'
    | 'ubidex'
    | 'youtube-block'
    | 'referrals'
    | 'providers'
    | 'turnstile';

type IFunctionImportModule = (name: TModuleName, callback: Function) => unknown;

export const modulesApp: Record<TModuleName, IFunctionImportModule> = {
    'core': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/core/core.module');
        callback(name, m);
        return m.CoreModule;
    },
    'affiliates': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/affiliates/affiliates.module');
        callback(name, m);
        return m.AffiliatesModule;
    },
    'menu': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/menu/menu.module');
        callback(name, m);
        return m.MenuModule;
    },
    'games': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/games/games.module');
        callback(name, m);
        return m.GamesModule;
    },
    'icon-list': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/icon-list/icon-list.module');
        callback(name, m);
        return m.IconListModule;
    },
    'user': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/user/user.module');
        callback(name, m);
        return m.UserModule;
    },
    'static': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/static/static.module');
        callback(name, m);
        return m.StaticModule;
    },
    'promo': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/promo/promo.module');
        callback(name, m);
        return m.PromoModule;
    },
    'pep': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/user/submodules/pep/pep.module');
        callback(name, m);
        return m.PepModule;
    },
    'sms': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/user/submodules/sms/sms.module');
        callback(name, m);
        return m.SmsModule;
    },
    'finances': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/finances/finances.module');
        callback(name, m);
        return m.FinancesModule;
    },
    'forms': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/forms/forms.module');
        callback(name, m);
        return m.FormsModule;
    },
    'extra-forms': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/forms/submodules/extra-forms/extra-forms.module');
        callback(name, m);
        return m.ExtraFormsModule;
    },
    'transfer': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/transfer/transfer.module');
        callback(name, m);
        return m.TransferModule;
    },
    'bonuses': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/bonuses/bonuses.module');
        callback(name, m);
        return m.BonusesModule;
    },
    'store': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/store/store.module');
        callback(name, m);
        return m.StoreModule;
    },
    'tournaments': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/tournaments/tournaments.module');
        callback(name, m);
        return m.TournamentsModule;
    },
    'profile': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/profile/profile.module');
        callback(name, m);
        return m.ProfileModule;
    },
    'sportsbook': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/sportsbook/sportsbook.module');
        callback(name, m);
        return m.SportsbookModule;
    },
    'livechat': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/livechat/livechat.module');
        callback(name, m);
        return m.LivechatModule;
    },
    'compiler': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/compiler/compiler.module');
        callback(name, m);
        return m.CompilerModule;
    },
    'custom': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-src/custom/custom.module');
        callback(name, m);
        return m.CustomModule;
    },
    'analytics': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/analytics/analytics.module');
        callback(name, m);
        return m.AnalyticsModule;
    },
    'monitoring': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/monitoring/monitoring.module');
        callback(name, m);
        return m.MonitoringModule;
    },
    'internal-mails': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/internal-mails/internal-mails.module');
        callback(name, m);
        return m.InternalMailsModule;
    },
    'lotteries': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/lotteries/lotteries.module');
        callback(name, m);
        return m.LotteriesModule;
    },
    'loyalty': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/loyalty/loyalty.module');
        callback(name, m);
        return m.LoyaltyModule;
    },
    'achievements': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/loyalty/submodules/achievements/achievements.module');
        callback(name, m);
        return m.AchievementsModule;
    },
    'quests': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/quests/quests.module');
        callback(name, m);
        return m.QuestsModule;
    },
    'metamask': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/metamask/metamask.module');
        callback(name, m);
        return m.MetamaskModule;
    },
    'history': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/history/history.module');
        callback(name, m);
        return m.HistoryModule;
    },
    // 'mobile': async (name: TModuleName, callback: Function) => {
    //     const m = await import('mobile-app-engine/modules/mobile/mobile.module');
    //     callback(name, m);
    //     return m.MobileModule;
    // },
    'deadsimplechat': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/deadsimplechat/deadsimplechat.module');
        callback(name, m);
        return m.DeadsimplechatModule;
    },
    'limitations': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/user/submodules/limitations/limitations.module');
        callback(name, m);
        return m.LimitationsModule;
    },
    'chat': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/chat/chat.module');
        callback(name, m);
        return m.ChatModule;
    },
    'captcha': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/security/captcha/captcha.module');
        callback(name, m);
        return m.CaptchaModule;
    },
    'rates': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/rates/rates.module');
        callback(name, m);
        return m.RatesModule;
    },
    'recaptcha': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/security/recaptcha/recaptcha.module');
        callback(name, m);
        return m.RecaptchaModule;
    },
    'referrals': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/referrals/referrals.module');
        callback(name, m);
        return m.ReferralsModule;
    },
    'cashback': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/cashback/cashback.module');
        callback(name, m);
        return m.CashbackModule;
    },
    'external-services': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/external-services/external-services.module');
        callback(name, m);
        return m.ExternalServicesModule;
    },
    'gambling-ban': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/restrictions/gambling-ban/gambling-ban.module');
        callback(name, m);
        return m.GamblingBanModule;
    },
    'seo': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/seo/seo.module');
        callback(name, m);
        return m.SeoModule;
    },
    'aml': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/aml/aml.module');
        callback(name, m);
        return m.AmlModule;
    },
    'multi-wallet': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/multi-wallet/multi-wallet.module');
        callback(name, m);
        return m.MultiWalletModule;
    },
    'two-factor-auth': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/user/submodules/two-factor-auth/two-factor-auth.module');
        callback(name, m);
        return m.TwoFactorAuthModule;
    },
    'signup': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/user/submodules/signup/signup.module');
        callback(name, m);
        return m.SignUpModule;
    },
    'login': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/user/submodules/login/login.module');
        callback(name, m);
        return m.LoginModule;
    },
    'wheel': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/wheel/wheel.module');
        callback(name, m);
        return m.WheelModule;
    },
    'qr-code': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/qr-code/qr-code.module');
        callback(name, m);
        return m.QrCodeModule;
    },
    'pwa': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/pwa/pwa.module');
        callback(name, m);
        return m.PwaModule;
    },
    'local-jackpots': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/local-jackpots/local-jackpots.module');
        callback(name, m);
        return m.LocalJackpotsModule;
    },
    'ubidex': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/ubidex/ubidex.module');
        callback(name, m);
        return m.UbidexModule;
    },
    'currency': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/currency/currency.module');
        callback(name, m);
        return m.CurrencyModule;
    },
    'providers': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/providers/providers.module');
        callback(name, m);
        return m.ProvidersModule;
    },
    'turnstile': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/security/turnstile/turnstile.module');
        callback(name, m);
        return m.TurnstileModule;
    },
    'youtube-block': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/youtube-block/youtube-block.module');
        callback(name, m);
        return m.YoutubeBlockModule;
    },
} as const;

// STANDALONE
export type TStandaloneName = keyof typeof standaloneComponents;
export type TCallbackImportFunction = (component: Type<unknown>) => void;
export type IFunctionImportStandalone = (callback: TCallbackImportFunction) => Promise<Type<unknown>>;
/**
 * List of standalone components with import functions
 * TODO: драфт доки, драфт нейминга
 *
 * !! Подумай дважды прежде чем определиться именем компонента))
 * А лучше посоветуйся с кем-нибудь)
 *
 * Naming rules:
 * - В объекте комментариями уже написаны примеры. Там же комментариями со звездочками визуально
 * разбито на блоки, так что комментарии со звездочками не удалять
 *
 * - Если компонент зависит от другого, например является темой вынесенной в сабкомпонент,
 * или сабкомпонент с редко нужной логикой, то его имя формируется из названия модуля, названия родительского
 * компонента и названия саого копонента, все в кебаб-кейсе, например:
 * `core.parent-component.child-sa-component`
 *
 * - Если компонент является самостоятельным, и может использоваться в разных местах, то
 * название указывается просто кебабкейсом в алфавитном порядке.
 *
 * @example
 * ```typescript
    'test': async (callback: TCallbackImportFunction) => {
        const m = await import('wlc-engine/modules/standalone/components/test/test.component');
        callback(m.TestComponent);
        return m.TestComponent;
    },
 * ```
 */
export const standaloneComponents = {
    /** === Parent dependent standalone (by module) START === */
    /** ! Bonuses */
    // 'bonuses.bonus-item.bonus-item-promo': async (callback: TCallbackImportFunction) => {
    //     const m = await import('wlc-engine/modules/bonuses/components/bonus-item/themes/bonus-item-promo.component');
    //     callback(m.BonusItemPromo);
    //     return m.BonusItemPromo;
    // },
    /** === Parent dependent standalone (by module) END === */

    /** === Independent components START === */
    'wlc-language-selector': async (callback: TCallbackImportFunction) => {
        return import('wlc-engine/standalone/core/components/language-selector/language-selector.component')
            .then((m) => {
                callback(m.LanguageSelectorComponent);
                return m.LanguageSelectorComponent;
            });
    },
    'wlc-google-one-tap': async (callback: TCallbackImportFunction) => {
        return import('wlc-engine/standalone/core/components/google-one-tap/google-one-tap.component')
            .then((m) => {
                callback(m.GoogleOneTapComponent);
                return m.GoogleOneTapComponent;
            });
    },
    'wlc-error-page': async (callback: TCallbackImportFunction) => {
        return import('wlc-engine/standalone/core/components/error-page/error-page.component')
            .then((m) => {
                callback(m.ErrorPageComponent);
                return m.ErrorPageComponent;
            });
    },
    'wlc-something-wrong-page': async (callback: TCallbackImportFunction) => {
        return import('wlc-engine/standalone/core/components/something-wrong-page/something-wrong-page.component')
            .then((m) => {
                callback(m.SomethingWrongPageComponent);
                return m.SomethingWrongPageComponent;
            });
    },
    'wlc-amount-limit': async (callback: TCallbackImportFunction) => {
        return import('wlc-engine/standalone/core/components/amount-limit/amount-limit.component')
            .then((m) => {
                callback(m.AmountLimitComponent);
                return m.AmountLimitComponent;
            });
    },
    'wlc-animate-sprite': async (callback: TCallbackImportFunction) => {
        return import('wlc-engine/standalone/core/components/animate-sprite/animate-sprite.component')
            .then((m) => {
                callback(m.AnimateSpriteComponent);
                return m.AnimateSpriteComponent;
            });
    },
    'wlc-game-thumb': async (callback: TCallbackImportFunction) => {
        return import('wlc-engine/standalone/games/components/game-thumb/game-thumb.component')
            .then((m) => {
                callback(m.GameThumbComponent);
                return m.GameThumbComponent;
            });
    },
    'wlc-games-grid': async (callback: TCallbackImportFunction) => {
        return import('wlc-engine/standalone/games/components/games-grid/games-grid.component')
            .then((m) => {
                callback(m.GamesGridComponent);
                return m.GamesGridComponent;
            });
    },
    // 'some-sa-component-name': IFunctionImportStandalone
    // 'another-sa-component-name': IFunctionImportStandalone
    /** === Independent components END === */
} satisfies Record<string, IFunctionImportStandalone>;
