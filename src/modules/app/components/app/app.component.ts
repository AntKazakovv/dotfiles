import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
    StateService,
    Transition,
    TransitionService,
    UIRouter,
    UIRouterGlobals,
} from '@uirouter/core';
import {Title, Meta} from '@angular/platform-browser';
import {Subscription, fromEvent} from 'rxjs';
import {
    takeUntil,
    filter,
} from 'rxjs/operators';

import _assign from 'lodash-es/assign';
import _each from 'lodash-es/each';
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
export class AppComponent extends AbstractComponent implements OnInit, OnDestroy {
    public hostClass = defaultParams.class;
    public sections: SectionModel[] = [];
    public panels: SectionModel[] = [];

    private testViewPort = false;
    private isIOS: boolean = false;
    private additionalHostClass = [];
    private allSections: SectionModel[] = [];
    private resize$: Subscription;
    private auth$: Subscription;

    constructor(
        public router: UIRouter,
        public configService: ConfigService,
        protected translate: TranslateService,
        protected stateService: StateService,
        protected layoutService: LayoutService,
        protected injectionService: InjectionService,
        protected eventService: EventService,
        protected uiRouter: UIRouterGlobals,
        protected cdr: ChangeDetectorRef,
        protected actionService: ActionService,
        protected modalService: ModalService,
        protected seo: SeoService,
        protected bodyClassService: BodyClassService,
        private transition: TransitionService,
        private meta: Meta,
        private logService: LogService,
        titleService: Title,
        @Inject(WINDOW) private window: Window,
    ) {
        super({injectParams: {}, defaultParams}, configService);
        this.configService.set({name: 'firstLanguageReady', value: new Deferred()});
        this.resolveLang();

        const siteName = this.configService.get<string>('$base.site.name');
        if (siteName) {
            titleService.setTitle(siteName);
        }
        this.isIOS = this.actionService.device.osName === 'ios';

        this.loadAnalytics();
        this.launchMonitoring();
    }

    public async ngOnInit(): Promise<void> {
        const depositInIframe = this.configService.get<boolean>('$base.finances.depositInIframe');

        if (depositInIframe && GlobalHelper.isIframe(this.window)) {
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

        let filteredPanels = [];
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

    public trackBySectionName(index: number, section: SectionModel): string {
        return section.name;
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
        const processConfigsLocal = this.configService.get<TProcessConfigs>('$base.monitoring.processConfigs');
        if (_some(processConfigsCommon, ['use', true])
            || _some(processConfigsLocal, ['use', true])
        ) {
            this.injectionService.getService<ProcessService>('monitoring.process-service');
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
        this.translate.addLangs(this.configService.get<ILanguage[]>('appConfig.languages').map((lang) => lang.code));
        const {locale} = this.uiRouter.params;

        if (_includes(this.translate.langs, locale)) {
            this.translate.setDefaultLang(locale);
            this.translate.use(locale).toPromise().then(() => {
                this.configService.get<Deferred<null>>({name: 'firstLanguageReady'}).resolve();
            });
            this.configService.set({name: 'currentLanguage', value: this.translate.currentLang});
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
        this.transition.onSuccess({}, () => {
            this.setHostClass();
            this.getAllSections();
            this.updateSections();
            if (!this.configService.get<boolean>('$base.app.demoMode')) {
                this.actionService.scrollTo();
            }
        });

        this.transition.onEnter({}, (transition: Transition) => {
            this.eventService.emit({
                name: 'TRANSITION_ENTER',
                data: {
                    transition,
                },
            });
        });

        this.transition.onStart({}, () => {
            this.modalService.closeAllModals('any');
        });
    }
}
