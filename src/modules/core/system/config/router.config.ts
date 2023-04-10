import {Injector} from '@angular/core';
import {
    Transition,
    UIRouter,
} from '@uirouter/core';

import _keys from 'lodash-es/keys';
import _each from 'lodash-es/each';
import _includes from 'lodash-es/includes';
import _isNil from 'lodash-es/isNil';
import {
    BehaviorSubject,
    first,
    firstValueFrom,
} from 'rxjs';

import {
    IRedirect,
    IIndexing,
    ConfigService,
    profileRedirectType,
    EventService,
    StateHistoryService,
    IStateModalOption,
    ForbiddenCountryService,
    ModalService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {AppType} from 'wlc-engine/modules/core/system/interfaces/base-config/app.interface';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import {TermsAcceptService} from 'wlc-engine/modules/user';

export function routerConfigFn(router: UIRouter, injector: Injector) {
    const configService: ConfigService = injector.get(ConfigService);
    const eventService: EventService = injector.get(EventService);
    const stateHistoryService: StateHistoryService = injector.get(StateHistoryService);

    configService.ready.then(() => {
        const lang = configService.get<string>('appConfig.language') || 'en';
        const profileType = configService.get<profileRedirectType>('$base.profile.type');
        const stateRedirects = configService.get<IIndexing<IRedirect>>('$base.redirects.states') || {};
        const profileRedirectsMap =
            configService.get<IIndexing<profileRedirectType>>('$base.redirects.profileRedirects');
        const isKiosk: boolean = configService.get<AppType>('$base.app.type') === 'kiosk';
        const kioskHideSigninState: boolean = configService.get<boolean>('$base.kiosk.hideSigninState');
        const criteria = ({name}): boolean => {
            return _includes(_keys(profileRedirectsMap), name);
        };
        const kioskAuthUserOnlyCriteria = ({name}): boolean => {
            return isKiosk && !configService.get<boolean>('$user.isAuthenticated') && name !== 'app.signin';
        };

        const renamedSlugs = configService.get<IIndexing<string>>('$games.categories.renameSlugs');

        if (renamedSlugs) {
            router.transitionService.onBefore({}, (trans: Transition) => {
                const params = {...trans.params()};
                if (params?.category && renamedSlugs[params.category]) {
                    params.category = renamedSlugs[params.category];
                    trans.abort();
                    router.stateService.go(trans.to().name, params);
                }
            });
        };

        const stateModals = configService.get<IIndexing<IStateModalOption>>('$modals.states');

        router.urlService.rules.initial({state: 'app.home', params: {locale: lang}});

        if (_keys(stateRedirects).length) {
            _each(stateRedirects, (redirect, state) => {
                if (profileType === redirect.profile || !redirect.profile) {
                    router.transitionService.onEnter({to: state}, (trans: Transition) => {
                        return router.stateService.target(redirect.state, redirect?.params || trans.params());
                    });
                }
            });
        }

        if (isKiosk && !kioskHideSigninState) {
            router.transitionService.onBefore({to: kioskAuthUserOnlyCriteria}, (trans: Transition) => {
                trans.abort();
                router.stateService.go('app.signin', trans.params());
            });
        }

        useCountryRestriction(injector, configService);

        if (configService.get<string>('appConfig.siteconfig.termsOfService')) {
            let termsAcceptService: TermsAcceptService;
            const modalService: ModalService = injector.get(ModalService);
            router.transitionService.onBefore({}, async (trans: Transition) => {
                if (!termsAcceptService) {
                    const injectionService = injector.get(InjectionService);
                    termsAcceptService = await injectionService
                        .getService<TermsAcceptService>('user.terms-accept-service');
                    await injectionService.getService('user.user-service');
                }
                if (configService.get<boolean>('$user.isAuthenticated')
                    && !termsAcceptService.checkState(trans.to().name, trans.params())
                ) {
                    const userInfo$ = configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'});
                    const userInfo = userInfo$.value ?? await firstValueFrom(userInfo$.pipe(first((v) => !!v)));

                    if (shouldTermsModalBeShown(modalService, userInfo)) {
                        termsAcceptService.showDeniedNotify();

                        const res = await modalService.showModal('accept-terms', {source: 'router'});
                        await res.closed;
                        if (res.closeReason !== 'accept') {
                            trans.abort();
                            if (!termsAcceptService.checkState(router.globals.current.name, router.globals.params)) {
                                router.stateService.go('app.home', trans.params());
                            }
                        } else {
                            router.stateService.reload();
                        }
                    }
                }
            });
        }

        router.transitionService.onBefore({to: criteria}, (trans: Transition) => {
            if (profileType !== profileRedirectsMap?.[trans.to().name]) {
                return router.stateService.target('app.error', trans.params());
            }
        });

        router.transitionService.onExit({}, (trans, state) => {
            stateHistoryService.setFirstVisit(state.name);
        });

        // TODO: check state params, add subscribe for login/logout and more ...
        router.transitionService.onSuccess({}, (trans) => {
            stateHistoryService.setState(trans.$to(), trans.params('to'));

            _each(stateModals, (option, state) => {
                if (state !== trans.to().name) {
                    return;
                }
                const showModal: boolean[] = [];

                if (!_isNil(option.auth)) {
                    if (option.auth === 'any') {
                        showModal['auth'] = true;
                    } else {
                        showModal['auth'] = option.auth === configService.get<boolean>('$user.isAuthenticated');
                    }
                } else {
                    showModal['auth'] = false;
                }

                if (!_isNil(option.once)) {
                    if (option.once) {
                        showModal['once'] = option.once === stateHistoryService.checkFirstVisit(state);
                    } else {
                        showModal['once'] = true;
                    }
                } else {
                    showModal['once'] = false;
                }

                if (showModal['auth'] && showModal['once']) {
                    eventService.emit({
                        name: 'SHOW_MODAL',
                        data: option.modal,
                    });
                }
            });
        });
    });
}

function shouldTermsModalBeShown(modalService: ModalService, userInfo: UserInfo): boolean {
    return !userInfo.isTermsActual
        && !userInfo.blockByLocation
        && !modalService.getActiveModal('accept-terms');
}

async function useCountryRestriction(injector: Injector, configService: ConfigService): Promise<void> {
    if (isCountryRestrictionSettingEnabled(configService)) {
        const forbiddenCountryService = injector.get(ForbiddenCountryService);
        forbiddenCountryService.blockUrlChanging();
        await forbiddenCountryService.showModal();
    }
}

function isCountryRestrictionSettingEnabled(configService: ConfigService): boolean {
    const settingEnabled = configService.get<boolean>('$base.restrictions.country.use');
    const restricted = configService.get<boolean>('appConfig.countryRestricted');

    return settingEnabled && restricted;
}
