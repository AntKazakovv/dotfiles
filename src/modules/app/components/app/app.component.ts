import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    OnDestroy,
    OnInit,
    HostListener,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StateService, TransitionService, UIRouter, UIRouterGlobals} from '@uirouter/core';
import {takeUntil} from 'rxjs/operators';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {SectionModel} from 'wlc-engine/modules/core/system/models/section.model';
import {ConfigService, LayoutService} from '../../../core/system/services';
import {ILanguage} from 'wlc-engine/modules/core';
import {Title} from '@angular/platform-browser';

import {
    sortBy as _sortBy,
    get as _get,
} from 'lodash';


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
    ) {
        super({injectParams: {}, defaultParams}, configService);
        const currentLang = router.stateService.params?.locale || 'en';
        translate.addLangs(this.configService.get<ILanguage[]>('appConfig.languages').map((lang) => lang.code));
        translate.setDefaultLang(currentLang);
        translate.use(currentLang);
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

        this.panels = _sortBy(this.layoutService
            .getAllSection('panels', this.uiRouter.current.name, this.uiRouter.params), 'order');

        this.sections = _sortBy(this.layoutService
            .getAllSection('pages', this.uiRouter.current.name, this.uiRouter.params), 'order');

        this.transition.onSuccess({}, async (transition) => {
            this.setHostClass();
            this.sections = _sortBy(this.layoutService
                .getAllSection('pages', this.uiRouter.transition?.targetState().name(),
                    this.uiRouter.transition?.targetState().params()), 'order');
        });
        this.setHostClass();
        this.cdr.markForCheck();
    }

    private setHostClass(): void {
        const hostClass = [defaultParams.hostClass];
        hostClass.push(`${_get(this.uiRouter, '$current.name', '').replace(/\./g, '-')}-state`);
        this.$hostClass = hostClass.join(' ');
    }
}
