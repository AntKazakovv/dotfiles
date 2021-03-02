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
import {takeUntil} from 'rxjs/operators';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {SectionModel} from 'wlc-engine/modules/core/system/models/section.model';
import {ConfigService, LayoutService} from '../../../core/system/services';
import {ILanguage} from 'wlc-engine/modules/core';
import {DeviceModel} from 'wlc-engine/modules/core';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {filter} from 'rxjs/operators';

import {
    sortBy as _sortBy,
    get as _get,
    includes as _includes,
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

    constructor(
        public router: UIRouter,
        public configService: ConfigService,
        protected translate: TranslateService,
        protected stateService: StateService,
        protected layoutService: LayoutService,
        protected uiRouter: UIRouterGlobals,
        protected cdr: ChangeDetectorRef,
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
            `${_get(this.uiRouter, '$current.name', '').replace(/\./g, '-')}-state`,
        ];
        this.$hostClass = hostClass.join(' ');
    }

    private updateMetaTag(): void {
        const current = this.meta.getTag('name=\'viewport\'')?.attributes.getNamedItem('content').value;

        if (window.matchMedia('(max-width: 375px)').matches && current === 'width=device-width, initial-scale=1') {
            this.meta.updateTag({
                name: 'viewport',
                content: 'width=375',
            });
            return;
        }

        if (current === 'width=375') {
            this.testViewPort = true;

            this.meta.updateTag({
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            });

            if (window.matchMedia('(max-width: 375px)').matches) {
                this.meta.updateTag({
                    name: 'viewport',
                    content: 'width=375',
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

        if(_includes(this.translate.langs, locale)) {
            this.translate.setDefaultLang(locale);
            this.translate.use(locale);
        } else {
            this.stateService.go('app.error', {
                locale: 'en',
            });
        }
    }
}
