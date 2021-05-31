import {Ng2StateDeclaration} from '@uirouter/angular';
import {StateHelper} from '../helpers/state.helper';

import {AppComponent} from 'wlc-engine/modules/app/components/app/app.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services';
import {LayoutComponent} from 'wlc-engine/modules/core/components/layout/layout.component';
import {polyfillsResolver} from 'wlc-engine/modules/core/system/config/resolvers';
import {customStates} from 'wlc-src/custom/system/config/custom.states';
import * as States from './states';

import _map from 'lodash-es/map';
import _merge from 'lodash-es/merge';

let states = {
    'app.home': States.homeState,
    'app.catalog': States.catalogState,
    'app.catalog.child': States.catalogChildState,
    'app.gameplay': States.gamePlayState,
    'app.pages': States.pagesState,
    'app.contacts': States.contactsState,
    'app.promotions': States.promotionsState,
    'app.sportsbook': States.sportsbookState,
    'app.betradar': States.betradarState,
    'app.digitain': States.digitainState,
    'app.pinnacle': States.pinnacleState,
    'app.altenar': States.altenarState,
    'app.tglab': States.tglabState,
    'app.bti': States.btiState,
    'app.profile': States.profileState,
    'app.profile.main': States.profileMainState,
    'app.profile.main.info': States.profileMainInfoState,
    'app.profile.social': States.profileState,
    'app.profile.history': States.profileHistoryState,
    'app.profile.loyalty-bonuses': States.profileBonusesState,
    'app.profile.loyalty-bonuses.main': States.profileBonusesMainState,
    'app.profile.loyalty-bonuses.active': States.profileBonusesActiveState,
    'app.profile.loyalty-bonuses.inventory': States.profileBonusesInventoryState,
    'app.profile.loyalty-bonuses.history': States.profileBonusesHistoryState,
    'app.profile.loyalty-bonuses.promo': States.profileBonusesPromoState,
    'app.profile.loyalty-bonuses.system': States.profileBonusesSystemState,
    'app.profile.loyalty-tournaments': States.profileTournamentsState,
    'app.profile.loyalty-tournaments.main': States.profileTournamentsMainState,
    'app.profile.loyalty-tournaments.active': States.profileTournamentsActiveState,
    'app.profile.loyalty-tournaments.history': States.profileTournamentsHistoryState,
    'app.profile.loyalty-tournaments.detail': States.profileTournamentsDetailState,
    'app.profile.loyalty-store': States.profileStoreState,
    'app.profile.loyalty-store.main': States.profileStoreMain,
    'app.profile.loyalty-store.orders': States.profileStoreOrders,
    'app.profile.cash': States.profileCashState,
    'app.profile.cash.deposit': States.profileCashDepositState,
    'app.profile.cash.withdraw': States.profileCashWithdrawState,
    'app.profile.cash.wallet': States.profileCashWalletState,
    'app.profile.cash.transactions': States.profileCashTransactionsState,
    'app.profile.gamblings': States.profileGamblingsState,
    'app.profile.gamblings.bets': States.profileGamblingsBetsState,
    'app.profile.messages': States.profileMessagesState,
    'app.profile.verification': States.profileVerificationState,
    'app.profile.limitations': States.profileLimitationsState,
    'app.profile.password': States.profilePasswordState,
    'app.profile.notifications': States.profileNotificationsState,
    'app.profile.payments': States.profilePaymentsState,
    'app.profile.limits': States.profileLimitsState,
    'app.profile.loyalty-level': States.profileLoyaltyLevelState,
    'app.profile.referrals': States.profileReferralsState,
    'app.profile.dashboard': States.profileDashboardState,
    'app.error': States.errorPageState,
    'app.tournaments': States.tournamentsState,
    'app.providers': States.providersState,
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
            resolveFn: async (config: ConfigService) => {
                await config.ready;
                return config.get<string>('appConfig.language');
            },
        },
        polyfillsResolver,
    ],
};

if (Object.keys(customStates).length) {
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
