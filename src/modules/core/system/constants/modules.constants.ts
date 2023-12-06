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
    | 'loyalty'
    | 'achievements'
    | 'metamask'
    | 'history'
    | 'mobile'
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
    | 'youtube-block';

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
    'mobile': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/mobile/mobile.module');
        callback(name, m);
        return m.MobileModule;
    },
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
    'youtube-block': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/youtube-block/youtube-block.module');
        callback(name, m);
        return m.YoutubeBlockModule;
    },
    'wheel': async (name: TModuleName, callback: Function) => {
        const m = await import('wlc-engine/modules/wheel/wheel.module');
        callback(name, m);
        return m.WheelModule;
    },
} as const;
