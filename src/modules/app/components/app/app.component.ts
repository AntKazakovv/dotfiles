import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    AfterViewInit,
    ViewChild,
    ElementRef,
    HostListener,
} from '@angular/core';
import {
    DOCUMENT,
    Location,
} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {Title, Meta} from '@angular/platform-browser';
import {register as swiperRegister} from 'swiper/element/bundle';
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

import {OptimizationService} from 'wlc-engine/services';
import {ILanguage} from 'wlc-engine/modules/core/system/interfaces/app-config.interface';
import {IHooksConfig} from 'wlc-engine/modules/core/system/interfaces/base-config/hooks.interface';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ActionService} from 'wlc-engine/modules/core/system/services/action/action.service';
import {Deferred} from 'wlc-engine/modules/core/system/classes/deferred.class';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {LayoutService} from 'wlc-engine/modules/core/system/services/layout/layout.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {SectionModel} from 'wlc-engine/modules/core/system/models/section.model';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {BodyClassService} from 'wlc-engine/modules/core/system/services/body-class/body-class.service';
import {HooksService} from 'wlc-engine/modules/core/system/services/hooks/hooks.service';
import {TimerService} from 'wlc-engine/modules/core/system/services/timer/timer.service';
import {RouterService} from 'wlc-engine/modules/core/system/services/router/router.service';
import {
    routerEventNames,
    TLifecycleEvent,
} from 'wlc-engine/modules/core/system/services/router/types';
import {
    ILivechatConfig,
    CommonChatService,
} from 'wlc-engine/modules/livechat';
import {SeoService} from 'wlc-engine/modules/seo';
import {IAnalytics} from 'wlc-engine/modules/analytics/system/interfaces/analytics.interface';
import {AnalyticsService} from 'wlc-engine/modules/analytics';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {
    ProcessService,
    TProcessConfigs,
} from 'wlc-engine/modules/monitoring';
import {processConfigsCommon} from 'wlc-engine/modules/monitoring/system/config/process.config';
import {IIntercomSetup} from 'wlc-engine/modules/external-services/system/interfaces/intercom.interface';
import {IntercomService} from 'wlc-engine/modules/external-services/system/services';
import {BannersService} from 'wlc-engine/modules/promo';
import {UbidexService} from 'wlc-engine/modules/ubidex';
import {IUbidexConfig} from 'wlc-engine/modules/ubidex/system/interfaces';
import {MonitoringService} from 'wlc-engine/services/monitoring/monitoring.service';

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
        return _find(this.sections, (v) => v.name === 'nav-header');
    }

    public get navSection(): SectionModel {
        return _find(this.sections, (v) => v.name === 'nav-footer');
    }

    public get sectionsList(): SectionModel[] {
        if (this.isMobileApp) {
            return this.sections.filter((v) => !_includes(['nav-header', 'nav-footer'], v.name));
        }
        return this.sections;
    }

    protected optimizationService: OptimizationService;
    protected monitoringService: MonitoringService;

    private testViewPort = false;
    private isIOS: boolean = false;
    private additionalHostClass: string[] = [];
    private allSections: SectionModel[] = [];
    private resize$: Subscription;
    private auth$: Subscription;
    private sections: SectionModel[] = [];

    constructor(
        protected routerService: RouterService,
        protected translateService: TranslateService,
        protected layoutService: LayoutService,
        protected injectionService: InjectionService,
        protected eventService: EventService,
        protected hookService: HooksService,
        protected actionService: ActionService,
        protected modalService: ModalService,
        protected bodyClassService: BodyClassService,
        protected timerService: TimerService,
        private meta: Meta,
        private logService: LogService,
        private location: Location,
        titleService: Title,
        @Inject(WINDOW) private window: Window,
        @Inject(DOCUMENT) private document: Document,
    ) {
        super({injectParams: {}, defaultParams});
        this.configService.set({name: 'firstLanguageReady', value: new Deferred()});
        this.resolveLang();

        const siteName = this.configService.get<string>('$base.site.name');
        if (siteName) {
            titleService.setTitle(siteName);
        }
        this.isIOS = this.actionService.device.osName === 'ios';

        this.externalServices();
        this.loadAnalytics();
        this.launchMonitoring();
        this.initHookHandlers();
        this.launchGamblingBanFeature();
        this.enableSeo();
        this.loadUbidex();
    }

    @HostListener('document:visibilitychange', ['$event'])
    public visibilityChange(): void {
        if (document.hidden) {
            this.timerService.rememberLastCount();
        } else {
            this.timerService.updateCountAfterDocumentHidden();
        }
    }

    public override async ngOnInit(): Promise<void> {
        this.setMobileAppHandlers();

        if (GlobalHelper.isIframe(this.window) && this.checkAllowedReferrers()) {
            return;
        }

        this.translateService.onLangChange.pipe(takeUntil(this.$destroy)).subscribe((v) => {
            this.routerService.navigate(
                this.routerService.current.alias,
                _assign({}, this.routerService.current.params, {locale: v.lang}),
            );
        });

        this.setTransitionHooks();

        this.panels = _sortBy(this.layoutService
            .getAllSection('panels', this.routerService.current.alias, this.routerService.current.params), 'order');
        this.allSections = _sortBy(this.layoutService
            .getAllSection('pages', this.routerService.current.alias, this.routerService.current.params), 'order');
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

        let pushedReadyOnce = true;

        const ready = this.eventService.subscribe<{sectionName: string}>({name: 'SECTION_READY'}, (event) => {
            _remove(sections, (item) => item === event.sectionName);

            if (pushedReadyOnce) {
                this.window.postMessage({app: 'app-ready'});
                pushedReadyOnce = false;
            }

            if (!sections.length) {
                ready.unsubscribe();
                this.additionalHostClass.push('app-ready');
                this.checkLaunchMode();
                this.addLivechat();
                this.loadIntercom();
                this.setHostClass();
                this.logService.sendLog({
                    code: '0.0.9',
                    flog: {
                        downlink: _get(this.window, 'navigator.connection.downlink', 0),
                        effectiveType: _get(this.window, 'navigator.connection.effectiveType', ''),
                        launchMode: this.configService.get({name: 'launchMode', storageType: 'sessionStorage'}),
                    },
                    from: {
                        component: 'AppComponent',
                        method: 'ngOnInit',
                    },
                });
                this.window.WlcFlog?.setCompileSuccess();

                if (this.configService.get('utm')) {
                    this.location.replaceState(this.location.path(), this.configService.get('utm'));
                }
            }
        });

        this.setWatcher();
        this.setHostClass();
        this.updateMetaTag();

        this.injectionService.getService<BannersService>('promo.banners-service');

        fromEvent(this.window, 'resize').pipe(filter(() => !this.testViewPort)).subscribe(() => {
            this.updateMetaTag();
        });

        if (!this.timerService.startedCount) this.timerService.startCount();
    }

    public ngAfterViewInit(): void {
        if (GlobalHelper.isMobileApp() && this.appContent?.nativeElement) {
            this.actionService.setScrollableElement(this.appContent.nativeElement, 'appContent');
        }
        swiperRegister();
    }

    public trackBySectionName(index: number, section: SectionModel): string {
        return section.name;
    }

    protected externalServices(): void {
        this.setOptimizationService();
        this.setMonitoringService();
    }

    private async setOptimizationService(): Promise<void> {
        this.optimizationService = await this.injectionService
            .getExternalService<OptimizationService>('optimization');
    }

    private async setMonitoringService(): Promise<void> {
        this.monitoringService = await this.injectionService
            .getExternalService<MonitoringService>('monitoring');
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

            if (
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
                this.routerService.navigate('app.welcome');
            }

            let mobileAppUrlPath: string;

            document.addEventListener('deviceready', () => {
                GlobalHelper.appLockScreenOrientation('portrait');

                this.window.universalLinks?.subscribe(null, (eventData: universalLinks.IEventData): void => {
                    mobileAppUrlPath = eventData.url.replace(`${eventData.scheme}://${eventData.host}`, '');

                    if (mobileAppUrlPath) {
                        this.routerService.urlService.url(mobileAppUrlPath);
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
            .getAllSection('pages', this.routerService.current.alias,
                this.routerService.current.params), 'order');

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
            `${_get(this.routerService, 'current.alias', '').replace(/\./g, '-')}-state`,
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

        this.translateService.addLangs(languages);
        const {locale} = this.routerService.current.params;

        if (_includes(this.translateService.langs, locale)) {
            this.translateService.setDefaultLang(locale);
            this.translateService.use(locale).toPromise().then(() => {
                this.configService.get<Deferred<null>>({name: 'firstLanguageReady'}).resolve();
            });
            this.configService.set({name: 'currentLanguage', value: this.translateService.currentLang});

            if (GlobalHelper.isMobileApp()) {
                this.configService.set({
                    name: 'currentLanguage',
                    value: this.translateService.currentLang,
                    storageType: 'localStorage',
                });
            }
        } else {
            this.routerService.navigate('app.error', {
                locale: _includes(this.translateService.langs, this.configService.get<string>('appConfig.language'))
                    ? this.configService.get<string>('appConfig.language')
                    : (this.translateService.langs[0] || 'en'),
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

    private setTransitionHooks(): void {
        this.routerService.events$.pipe(
            takeUntil(this.$destroy),
        ).subscribe((event: TLifecycleEvent) => {
            // @ts-ignore no-implicit-any #672571
            if (routerEventNames[event.name]) {
                this.eventService.emit({
                    // @ts-ignore no-implicit-any #672571
                    name: routerEventNames[event.name],
                    data: event.transition,
                });
            }

            if (event.name === 'onStart') {
                this.modalService.closeAllModals('any');
            } else if (event.name === 'onSuccess') {
                this.setHostClass();
                this.getAllSections();
                this.updateSections();

                if (!this.configService.get<boolean>('$base.app.demoMode')) {
                    this.actionService.scrollTo();
                }

                setTimeout(() => {
                    this.cdr.detectChanges();
                });
            }
        });
    }

    private checkAllowedReferrers(): boolean {
        if (this.document.referrer) {
            const referrer = new URL(this.document.referrer);
            const allowedDomains = this.configService.get<string[]>('$base.allowedIframeReferrers') || [];
            return !allowedDomains.includes(referrer.hostname);
        }
        return true;
    }

    private async enableSeo(): Promise<void> {
        await this.configService.ready;
        if (this.configService.get<boolean>('$base.seo.use')) {
            this.injectionService.getService<SeoService>('seo.seo-service');
        }
    }

    private async loadIntercom(): Promise<void> {
        await this.configService.ready;
        const intercomConfig = this.configService.get<IIntercomSetup>('$base.intercom');

        if (!intercomConfig || !intercomConfig.appId) {
            return;
        }
        this.injectionService.getService<IntercomService>('external-services.intercom-service');
    }

    private async loadUbidex(): Promise<void> {
        await this.configService.ready;
        const ubidexConfig = this.configService.get<IUbidexConfig>('$base.ubidex');

        if (!ubidexConfig || !ubidexConfig?.use) {
            return;
        }

        this.injectionService.getService<UbidexService>('ubidex.ubidex-service');
    }

    private checkLaunchMode(): void {
        const isStandalone = this.window.matchMedia('(display-mode: standalone)').matches;

        if (isStandalone) {
            this.configService.set({name: 'launchMode', value: 'pwa', storageType: 'sessionStorage'});
        } else {
            this.configService.set({name: 'launchMode', value: 'browser', storageType: 'sessionStorage'});
            this.window.addEventListener('appinstalled', () => {
                this.logService.sendLog({code: '34.0.0'});
            });
        }
    }
}
