import {Ng2StateDeclaration} from '@uirouter/angular';

import _map from 'lodash-es/map';
import _merge from 'lodash-es/merge';
import _find from 'lodash-es/find';
import _keys from 'lodash-es/keys';

import {StateHelper} from '../helpers/state.helper';
import {AppComponent} from 'wlc-engine/modules/app/components/app/app.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {ILanguage} from 'wlc-engine/modules/core/system/interfaces/app-config.interface';
import {LayoutComponent} from 'wlc-engine/modules/core/components/layout/layout.component';
import {polyfillsResolver} from 'wlc-engine/modules/core/system/config/resolvers/polyfills.resolver';
import {customStates} from 'wlc-src/custom/system/config/custom.states';
import * as States from './states';

let states = {
    'app.home': States.homeState,
    'app.catalog': States.catalogState,
    'app.catalog.child': States.catalogChildState,
    'app.gameplay': States.gamePlayState,
    'app.pages': States.pagesState,
    'app.instructions': States.instructionsState,
    'app.contacts': States.contactsState,
    'app.contact-us': States.contactUsState,
    'app.promotions': States.promotionsState,
    'app.sportsbook': States.sportsbookState,
    'app.betradar': States.betradarState,
    'app.digitain': States.digitainState,
    'app.pinnacle': States.pinnacleState,
    'app.altenar': States.altenarState,
    'app.tglab': States.tglabState,
    'app.bti': States.btiState,
    'app.esport': States.esportState,
    'app.nova': States.novaState,
    'app.profile': States.profileState,
    'app.profile.main': States.profileMainState,
    'app.profile.main.info': States.profileMainInfoState,
    'app.profile.social': States.profileSocialState,
    'app.profile.history': States.profileHistoryState,
    'app.profile.loyalty-bonuses': States.profileBonusesState,
    'app.profile.loyalty-bonuses.main': States.profileBonusesMainState,
    'app.profile.loyalty-bonuses.offers': States.profileBonusesOffersState,
    'app.profile.loyalty-bonuses.active': States.profileBonusesActiveState,
    'app.profile.loyalty-bonuses.inventory': States.profileBonusesInventoryState,
    'app.profile.loyalty-bonuses.history': States.profileBonusesHistoryState,
    'app.profile.loyalty-bonuses.promo': States.profileBonusesPromoState,
    'app.profile.loyalty-bonuses.system': States.profileBonusesSystemState,
    'app.profile.loyalty-tournaments': States.profileTournamentsState,
    'app.profile.loyalty-tournaments.main': States.profileTournamentsMainState,
    'app.profile.loyalty-tournaments.history': States.profileTournamentsHistoryState,
    'app.profile.loyalty-tournaments.detail': States.profileTournamentsDetailState,
    'app.profile.loyalty-store': States.profileStoreState,
    'app.profile.loyalty-store.main': States.profileStoreMain,
    'app.profile.loyalty-store.orders': States.profileStoreOrders,
    'app.profile.loyalty-store.history': States.profileStoreOrdersHistory,
    'app.profile.cash': States.profileCashState,
    'app.profile.cash.deposit': States.profileCashDepositState,
    'app.profile.cash.withdraw': States.profileCashWithdrawState,
    'app.profile.cashback-rewards': States.profileCashbackState,
    'app.profile.cash.transactions': States.profileCashTransactionsState,
    'app.profile.cash.transfer': States.profileCashTransferState,
    'app.profile.gamblings': States.profileGamblingsState,
    'app.profile.gamblings.bets': States.profileGamblingsBetsState,
    'app.profile.messages': States.profileMessagesState,
    'app.profile.verification': States.profileVerificationState,
    'app.profile.kycaml': States.profileKycamlState,
    'app.profile.kyc-questionnaire': States.profileKycQuestionnaireState,
    'app.profile.limitations': States.profileLimitationsState,
    'app.profile.password': States.profilePasswordState,
    'app.profile.notifications': States.profileNotificationsState,
    'app.profile.limits': States.profileLimitsState,
    'app.profile.loyalty-level': States.profileLoyaltyLevelState,
    'app.profile.loyalty-program': States.profileLoyaltyProgramState,
    'app.profile.achievements': States.profileAchievementsState,
    'app.profile.achievements.main': States.profileAchievementsMainState,
    'app.profile.quests': States.profileQuestsState,
    'app.profile.quests.main': States.profileQuestsMainState,
    'app.profile.dashboard': States.profileDashboardState,
    'app.profile.referral': States.profileReferralState,
    'app.error': States.errorPageState,
    'app.offline': States.offlineState,
    'app.tournaments': States.tournamentsState,
    'app.providers': States.providersState,
    'app.providers.item': States.providersItemState,
    'app.user-social-register': States.userSocialRegister,
    'app.signup': States.signUpState,
    'app.login': States.loginState,
    'app.signin': States.signin,
    'app.something-wrong': States.somethingWrongState,
    'app.lotteries-detail': States.lotteryDetailState,
    'app.local-jackpots': States.localJackpotsState,
    'app.crypto-purchase-guide': States.cryptoPurchaseGuide,
};

const appState: Ng2StateDeclaration = {
    name: 'app',
    url: '/:locale',
    redirectTo: 'app.home',
    onEnter: StateHelper.onStateEnter,
    component: AppComponent,
    resolve: [
        {
            token: 'lang',
            deps: [ConfigService],
            resolveFn: async (config: ConfigService): Promise<string> => {
                await config.ready;

                const bootstrapLang: string = config.get({
                    name: 'currentLanguage',
                    storageType: 'localStorage',
                }) || config.get<string>('appConfig.language');

                const languages = config.get<ILanguage[]>('appConfig.languages') || [];

                if (_find(languages, (lang) => lang.code === bootstrapLang)) {
                    return bootstrapLang;
                } else {
                    return languages[0]?.code || 'en';
                }
            },
        },
        polyfillsResolver,
    ],
};

if (_keys(customStates).length) {
    states = _merge(states, customStates);
}

export const APP_STATES: Ng2StateDeclaration[] = [
    appState,
    ..._map(states, (state, key) => {
        return {
            name: key,
            component: LayoutComponent,
            ...state,
        };
    }),
];
