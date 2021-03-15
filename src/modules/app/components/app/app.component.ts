import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StateService, TransitionService, UIRouter, UIRouterGlobals} from '@uirouter/core';
import {Title, Meta} from '@angular/platform-browser';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {SectionModel} from 'wlc-engine/modules/core/system/models/section.model';
import {ConfigService, LayoutService, EventService, ILanguage, ActionService, DeviceModel} from 'wlc-engine/modules/core';

import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {takeUntil, filter} from 'rxjs/operators';

import {
    sortBy as _sortBy,
    get as _get,
    includes as _includes,
    union as _union,
    remove as _remove,
} from 'lodash-es';

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

    constructor(
        public router: UIRouter,
        public configService: ConfigService,
        protected translate: TranslateService,
        protected stateService: StateService,
        protected layoutService: LayoutService,
        protected eventService: EventService,
        protected uiRouter: UIRouterGlobals,
        protected cdr: ChangeDetectorRef,
        protected actionService: ActionService,
        private transition: TransitionService,
        private titleService: Title,
        private meta: Meta,
    ) {
        super({injectParams: {}, defaultParams}, configService);
        this.resolveLang();

        const siteName = this.configService.get<string>('$base.site.name');
        if (siteName) {
            titleService.setTitle(siteName);
        }
        this.isIOS = this.actionService.device.osName === 'ios';
    }

    public ngOnInit(): void {
        this.translate.onLangChange.pipe(takeUntil(this.$destroy)).subscribe((v) => {
            this.stateService.go(
                this.stateService.current.name,
                {locale: v.lang},
            );
        });

        this.router.transitionService.onStart({}, () => {
            window.scrollTo(0, 0);
        });

        this.panels = _sortBy(this.layoutService
            .getAllSection('panels', this.uiRouter.current.name, this.uiRouter.params), 'order');

        this.sections = _sortBy(this.layoutService
            .getAllSection('pages', this.uiRouter.current.name, this.uiRouter.params), 'order');

        const sections = _union(
            this.panels.map((item) => item.name),
            this.sections.map((item) => item.name),
        );
        const ready = this.eventService.subscribe<{sectionName: string}>({name: 'SECTION_READY'}, (event) => {
            _remove(sections, (item) => item === event.sectionName);
            if (!sections.length) {
                ready.unsubscribe();
                this.additionalHostClass.push('app-ready');
                this.setHostClass();
            }
        });

        this.transition.onSuccess({}, async (transition) => {
            this.setHostClass();
            const sections = _sortBy(this.layoutService
                .getAllSection('pages', this.uiRouter.transition?.targetState().name(),
                    this.uiRouter.transition?.targetState().params()), 'order');

            if (this.sections.length) {
                this.sections.length = 0;
            }
            this.sections.push(...sections);
        });
        this.setHostClass();
        this.updateMetaTag();
        this.cdr.markForCheck();

        fromEvent(window, 'resize').pipe(filter(() => !this.testViewPort)).subscribe(() => {
            this.updateMetaTag();
        });
    }

    public trackBySectionName(index: number, section: SectionModel): string {
        return section.name;
    }

    private setHostClass(): void {
        const hostClass = [
            defaultParams.hostClass,
            this.configService.get<DeviceModel>('device')?.osName,
            this.configService.get<DeviceModel>('device')?.browserName,
            `wlc-locale-${this.translate.currentLang}`,
            `${_get(this.uiRouter, '$current.name', '').replace(/\./g, '-')}-state`,
            ...this.additionalHostClass,
        ];
        this.$hostClass = hostClass.join(' ');
    }

    private updateMetaTag(): void {
        const current = this.meta.getTag('name=\'viewport\'')?.attributes.getNamedItem('content').value;

        if (window.matchMedia('(max-width: 375px)').matches && _includes(current, 'width=device-width, initial-scale=1')) {
            this.meta.updateTag({
                name: 'viewport',
                content: this.isIOS ? 'width=375, maximum-scale=1' : 'width=375',
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
                content: this.isIOS ? 'width=device-width, initial-scale=1, maximum-scale=1' : 'width=device-width, initial-scale=1',
            });

            if (window.matchMedia('(max-width: 375px)').matches) {
                this.meta.updateTag({
                    name: 'viewport',
                    content: this.isIOS ? 'width=375, maximum-scale=1' : 'width=375',
                });
            }
            setTimeout(() => {
                this.testViewPort = false;
            }, 0);
        }
    }

    private resolveLang(): void {
        this.translate.addLangs(this.configService.get<ILanguage[]>('appConfig.languages').map((lang) => lang.code));
        const {locale} = this.stateService.params;

        if (_includes(this.translate.langs, locale)) {
            this.translate.setDefaultLang(locale);
            this.translate.use(locale);
        } else {
            this.stateService.go('app.error', {
                locale: 'en',
            });
        }
    }
}
