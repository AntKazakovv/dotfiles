import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    AfterViewInit,
    ViewChild,
    ElementRef,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {
    StateParams,
    StateService,
    Transition,
    TransitionService,
    UIRouter,
    UIRouterGlobals,
} from '@uirouter/core';
import {Title, Meta} from '@angular/platform-browser';
import {
    Subscription,
    fromEvent,
} from 'rxjs';
import {
    takeUntil,
    filter,
} from 'rxjs/operators';

import _assign from 'lodash-es/assign';
import _each from 'lodash-es/each';
import _find from 'lodash-es/find';
import _filter from 'lodash-es/filter';
import _findIndex from 'lodash-es/findIndex';
import _get from 'lodash-es/get';
import _includes from 'lodash-es/includes';
import _isEqual from 'lodash-es/isEqual';
import _remove from 'lodash-es/remove';
import _sortBy from 'lodash-es/sortBy';
import _union from 'lodash-es/union';
import _some from 'lodash-es/some';

import {
    AbstractComponent,
    ActionService,
    ConfigService,
    Deferred,
    EventService,
    GlobalHelper,
    ILanguage,
    LayoutService,
    ModalService,
    SectionModel,
    SeoService,
    LogService,
    InjectionService,
    BodyClassService,
    IHooksConfig,
    HooksService,
} from 'wlc-engine/modules/core';
import {
    ILivechatConfig,
    CommonChatService,
} from 'wlc-engine/modules/livechat';
import {IAnalytics} from 'wlc-engine/modules/analytics/system/interfaces/analytics.interface';
import {AnalyticsService} from 'wlc-engine/modules/analytics';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {
    processConfigsCommon,
    ProcessService,
    TProcessConfigs,
} from 'wlc-engine/modules/monitoring';
import {IIntercomSetup} from 'wlc-engine/modules/external-services/system/interfaces/intercom.interface';
import {IntercomService} from 'wlc-engine/modules/external-services/system/services';

const defaultParams = {
    class: 'wlc-sections',
    hostClass: 'wlc-app-content',
};

@Component({
    selector: '[wlc-app-component]',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends AbstractComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('appContent') appContent: ElementRef;

    public hostClass = defaultParams.class;
    public panels: SectionModel[] = [];
    public isMobileApp: boolean = GlobalHelper.isMobileApp();

    public get headerSection(): SectionModel {
        return _find(this.sections, (v)=> v.name === 'nav-header');
    }

    public get navSection(): SectionModel {
        return _find(this.sections, (v)=> v.name === 'nav-footer');
    }

    public get sectionsList(): SectionModel[] {
        if (this.isMobileApp) {
            return this.sections.filter((v)=> !_includes(['nav-header', 'nav-footer'], v.name));
        }
        return this.sections;
    }

    private testViewPort = false;
    private isIOS: boolean = false;
    private additionalHostClass: string[] = [];
    private allSections: SectionModel[] = [];
    private resize$: Subscription;
    private auth$: Subscription;
    private sections: SectionModel[] = [];

    constructor(
        public router: UIRouter,
        configService: ConfigService,
        protected translate: TranslateService,
        protected stateService: StateService,
        protected layoutService: LayoutService,
        protected injectionService: InjectionService,
        protected eventService: EventService,
        protected hookService: HooksService,
        protected uiRouter: UIRouterGlobals,
        cdr: ChangeDetectorRef,
        protected actionService: ActionService,
        protected modalService: ModalService,
        protected seo: SeoService,
        protected bodyClassService: BodyClassService,
        private transition: TransitionService,
        private meta: Meta,
        private logService: LogService,
        titleService: Title,
        @Inject(WINDOW) private window: Window,
        @Inject(DOCUMENT) private document: Document,
    ) {
        super({injectParams: {}, defaultParams}, configService, cdr);
        this.configService.set({name: 'firstLanguageReady', value: new Deferred()});
        this.resolveLang();

        const siteName = this.configService.get<string>('$base.site.name');
        if (siteName) {
            titleService.setTitle(siteName);
        }
        this.isIOS = this.actionService.device.osName === 'ios';

        this.loadAnalytics();
        this.launchMonitoring();
        this.initHookHandlers();
        this.launchGamblingBanFeature();
    }

    public override async ngOnInit(): Promise<void> {
        this.setOfflineModeHandlers();
        this.setMobileAppHandlers();

        const depositInIframe = this.configService.get<boolean>('$base.finances.depositInIframe');
        if (depositInIframe && GlobalHelper.isIframe(this.window) && this.checkAllowedReferrers()) {
            return;
        }

        this.translate.onLangChange.pipe(takeUntil(this.$destroy)).subscribe((v) => {
            this.stateService.go(
                this.uiRouter.current.name,
                _assign({}, this.uiRouter.params, {locale: v.lang}),
            );
        });

        this.setTransitionHooks();

        this.panels = _sortBy(this.layoutService
            .getAllSection('panels', this.uiRouter.current.name, this.uiRouter.params), 'order');
        this.allSections = _sortBy(this.layoutService
            .getAllSection('pages', this.uiRouter.current.name, this.uiRouter.params), 'order');
        this.sections = this.layoutService.filterDisplayElements(this.allSections);

        let filteredPanels: SectionModel[] = [];
        if (!this.configService.get<boolean>('isPanelsFiltered')) {
            const deferred = new Deferred();
            const handler = this.eventService.subscribe({name: 'FILTER_PANELS'}, (data: SectionModel[]) => {
                filteredPanels = data;
                deferred.resolve();
                handler.unsubscribe();
            });
            await deferred.promise;
        } else {
            filteredPanels = this.sections;
        }
        const sections = _union(
            filteredPanels.map((item) => item.name),
            this.sections.map((item) => item.name),
        );
        const ready = this.eventService.subscribe<{sectionName: string}>({name: 'SECTION_READY'}, (event) => {
            _remove(sections, (item) => item === event.sectionName);
            if (!sections.length) {
                ready.unsubscribe();
                this.additionalHostClass.push('app-ready');
                this.setHostClass();
                this.addLivechat();
                this.loadIntercom();
                this.logService.sendLog({
                    code: '0.0.9',
                    flog: {
                        downlink: _get(this.window, 'navigator.connection.downlink', 0),
                        effectiveType: _get(this.window, 'navigator.connection.effectiveType', ''),
                    },
                    from: {
                        component: 'AppComponent',
                        method: 'ngOnInit',
                    },
                });
                this.window.WlcFlog?.setCompileSuccess();
            }
        });

        this.setWatcher();
        this.setHostClass();
        this.updateMetaTag();
        this.cdr.markForCheck();

        fromEvent(this.window, 'resize').pipe(filter(() => !this.testViewPort)).subscribe(() => {
            this.updateMetaTag();
        });
    }

    public ngAfterViewInit(): void {
        if (GlobalHelper.isMobileApp() && this.appContent?.nativeElement) {
            this.actionService.setScrollableElement(this.appContent.nativeElement, 'appContent');
        }
    }

    public trackBySectionName(index: number, section: SectionModel): string {
        return section.name;
    }

    private initHookHandlers(): void {
        const hooks: IHooksConfig = this.configService.get('$base.hooks');
        if (hooks?.handlers) {
            _each(hooks.handlers, (hook): void => {
                this.hookService.set(hook.name, hook.handler);
            });
        }
    }

    private setMobileAppHandlers(): void {
        if (GlobalHelper.isMobileApp()) {

            if(
                !this.configService.get({
                    name: 'welcomeWasShown',
                    storageType: 'localStorage',
                })
            ) {
                this.configService.set({
                    name: 'welcomeWasShown',
                    value: true,
                    storageType: 'localStorage',
                });
                this.stateService.go('app.welcome');
            }

            let mobileAppUrlPath: string;

            document.addEventListener('deviceready', () => {
                GlobalHelper.appLockScreenOrientation('portrait');

                this.window.universalLinks?.subscribe(null, (eventData: universalLinks.IEventData): void => {
                    mobileAppUrlPath = eventData.url.replace(`${eventData.scheme}://${eventData.host}`, '');

                    if (mobileAppUrlPath) {
                        this.router.urlService.url(mobileAppUrlPath);
                        setTimeout(() => {
                            const messageInfo = GlobalHelper.parseUrlMessageOrError(eventData.url);
                            if (messageInfo) {
                                const messageInfo = GlobalHelper.parseUrlMessageOrError(eventData.url);
                                this.actionService.processMessages(messageInfo);
                            }
                        }, 100);
                    }
                });

            }, false);

            this.eventService.subscribe({name: 'TRANSITION_FINISH'}, () => {
                this.appContent?.nativeElement.scrollTo(0, 0);
            });
        }
    }

    private async loadAnalytics(): Promise<void> {
        await this.configService.ready;
        const analyticsConfig = this.configService.get<IAnalytics>('$base.analytics');

        if (!analyticsConfig || !analyticsConfig?.use) {
            return;
        }

        this.injectionService.getService<AnalyticsService>('analytics.analytics-service');
    }

    private launchMonitoring(): void {
        const processConfigsRemote = this.configService.get<TProcessConfigs>('appConfig.siteconfig.monitoring');
        const processConfigsLocal = this.configService.get<TProcessConfigs>('$base.monitoring.processConfigs');
        if (_some(processConfigsCommon, ['use', true])
            || _some(processConfigsLocal, ['use', true])
            || _some(processConfigsRemote, ['use', true])
        ) {
            this.injectionService.getService<ProcessService>('monitoring.process-service');
        }
    }

    private launchGamblingBanFeature(): void {
        if (this.configService.get('$base.restrictions.gamblingBan.use')) {
            this.injectionService.getService('gambling-ban.gambling-ban-service');
        }
    }

    private updateSections(): void {
        if (this.sections) {
            this.sections.length = 0;
        }
        this.sections.push(...this.layoutService.filterDisplayElements(this.allSections));
        this.cdr.markForCheck();
    }

    private setWatcher(): void {
        if (GlobalHelper.hasDisplayResize(this.allSections)) {
            GlobalHelper.overrideDisplayResize(this.allSections);

            if (!this.resize$) {
                this.resize$ = fromEvent(this.window, 'resize').pipe(takeUntil(this.$destroy)).subscribe({
                    next: () => {
                        this.updateSections();
                    },
                });
            }
        }

        const auth = GlobalHelper.hasDisplayAuth(this.allSections);

        if (auth && !this.auth$) {
            this.auth$ = this.eventService.filter(
                [{name: 'LOGIN'}, {name: 'LOGOUT'}],
                this.$destroy)
                .subscribe({
                    next: () => {
                        setTimeout(() => {
                            this.updateSections();
                        }, 0);
                    },
                });
        }
    }

    private getAllSections(): void {
        const allSections = _sortBy(this.layoutService
            .getAllSection('pages', this.uiRouter.transition?.targetState().name(),
                this.uiRouter.transition?.targetState().params()), 'order');

        if (this.allSections.length) {
            const oldList = this.allSections.slice();

            _each(allSections, (section, key) => {
                const index = _findIndex(oldList, (item: SectionModel) => {
                    return section.name === item.name && _isEqual(section, item);
                });
                if (index !== -1) {
                    allSections[key] = oldList[index];
                    oldList.splice(index, 1);
                }
            });
        }

        if (this.allSections.length) {
            this.allSections.length = 0;
        }
        this.allSections.push(...allSections);
    }

    private setHostClass(): void {
        const hostClass = [
            defaultParams.hostClass,
            `${_get(this.uiRouter, '$current.name', '').replace(/\./g, '-')}-state`,
            ...this.additionalHostClass,
        ];
        this.$hostClass = hostClass.join(' ');
    }

    private updateMetaTag(): void {
        const current = this.meta.getTag('name=\'viewport\'')?.attributes.getNamedItem('content').value;

        if (this.window.matchMedia('(max-width: 375px)').matches
            && _includes(current, 'width=device-width, initial-scale=1')) {
            this.meta.updateTag({
                name: 'viewport',
                content: this.isIOS ? 'width=375, initial-scale=1, maximum-scale=1' : 'width=375',
            });
            return;
        } else {
            if (this.isIOS && !_includes(current, 'maximum-scale=1')) {
                this.meta.updateTag({
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1, maximum-scale=1',
                });
                return;
            }
        }

        if (_includes(current, 'width=375')) {
            this.testViewPort = true;

            this.meta.updateTag({
                name: 'viewport',
                content: this.isIOS
                    ? 'width=device-width, initial-scale=1, maximum-scale=1'
                    : 'width=device-width, initial-scale=1',
            });

            if (this.window.matchMedia('(max-width: 375px)').matches) {
                this.meta.updateTag({
                    name: 'viewport',
                    content: this.isIOS ? 'width=375, initial-scale=1, maximum-scale=1' : 'width=375',
                });
            }
            setTimeout(() => {
                this.testViewPort = false;
            }, 0);
        }
    }

    private resolveLang(): void {
        let languages = this.configService.get<ILanguage[]>('appConfig.languages').map((lang) => lang.code);
        const availableOnly: string[] = this.configService.get<string[]>('$base.site.languages.availableOnly');

        if (availableOnly) {
            languages = _filter(languages, (lang): boolean => {
                return _includes(availableOnly, lang);
            });
        }

        this.translate.addLangs(languages);
        const {locale} = this.uiRouter.params;

        if (_includes(this.translate.langs, locale)) {
            this.translate.setDefaultLang(locale);
            this.translate.use(locale).toPromise().then(() => {
                this.configService.get<Deferred<null>>({name: 'firstLanguageReady'}).resolve();
            });
            this.configService.set({name: 'currentLanguage', value: this.translate.currentLang});

            if (GlobalHelper.isMobileApp()) {
                this.configService.set({
                    name: 'currentLanguage',
                    value: this.translate.currentLang,
                    storageType: 'localStorage',
                });
            }
        } else {
            this.stateService.go('app.error', {
                locale: _includes(this.translate.langs, this.configService.get<string>('appConfig.language'))
                    ? this.configService.get<string>('appConfig.language')
                    : (this.translate.langs[0] || 'en'),
            });
        }
    }

    private async addLivechat(): Promise<void> {
        await this.configService.ready;
        if (!this.configService.get<ILivechatConfig>('$base.livechat')) {
            return;
        }
        await this.injectionService.getService<CommonChatService>('livechat.common-chat-service');
    }

    private setTransitionHooks() {
        this.transition.onSuccess({}, (transition: Transition): void => {
            this.eventService.emit({
                name: 'TRANSITION_SUCCESS',
                data: transition,
            });
            this.setHostClass();
            this.getAllSections();
            this.updateSections();
            if (!this.configService.get<boolean>('$base.app.demoMode')) {
                this.actionService.scrollTo();
            }

            setTimeout(() => {
                this.cdr.detectChanges();
            });
        });

        this.transition.onEnter({}, (transition: Transition): void => {
            this.eventService.emit({
                name: 'TRANSITION_ENTER',
                data: transition,
            });
        });

        this.transition.onFinish({}, (transition: Transition): void => {
            this.eventService.emit({
                name: 'TRANSITION_FINISH',
                data: transition,
            });
        });

        this.transition.onStart({}, () => {
            this.modalService.closeAllModals('any');
        });
    }

    private setOfflineModeHandlers(): void {
        let lastState: string;
        let lastStateParams: StateParams;

        this.window.addEventListener('online', () => {
            this.stateService.go(lastState, lastStateParams);
        });

        this.window.addEventListener('offline', () => {
            lastState = this.uiRouter.current.name;
            lastStateParams = _assign({}, this.uiRouter.params);

            this.stateService.go('app.offline');
        });

        if (!this.window.navigator.onLine) {
            this.stateService.go('app.offline');
        }
    }

    private checkAllowedReferrers(): boolean {
        if (this.document.referrer) {
            const referrer = new URL(this.document.referrer);
            const allowedDomains = this.configService.get<string[]>('$base.allowedIframeReferrers') || [];
            return !allowedDomains.includes(referrer.hostname);
        }
        return true;
    }

    private async loadIntercom(): Promise<void> {
        await this.configService.ready;
        const intercomConfig = this.configService.get<IIntercomSetup>('$base.intercom');

        if (!intercomConfig || !intercomConfig.appId) {
            return;
        }
        this.injectionService.getService<IntercomService>('external-services.intercom-service');
    }
}
