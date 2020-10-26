import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StateService, UIRouter} from '@uirouter/core';
import {takeUntil} from 'rxjs/operators';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {SectionModel} from 'wlc-engine/modules/core/models/section.model';
import {ConfigService, LayoutService} from '../modules/core/services';

const defaultParams = {
    class: 'wlc-sections'
};

@Component({
    selector: '[app-component]',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends AbstractComponent implements OnInit, OnDestroy {
    public hostClass = defaultParams.class;

    public sections: SectionModel[] = [];

    constructor(
        public router: UIRouter,
        public configService: ConfigService,
        protected translate: TranslateService,
        protected stateService: StateService,
        protected layoutService: LayoutService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams: {}, defaultParams});
        const currentLang = router.stateService.params?.locale || 'en';
        translate.addLangs(configService.appConfig.languages.map((lang) => lang.code));
        translate.setDefaultLang(currentLang);
        translate.use(currentLang);
    }

    public ngOnInit(): void {
        this.translate.onLangChange.pipe(takeUntil(this.$destroy)).subscribe((v) => {
            this.stateService.go(
                this.stateService.current.name,
                {locale: v.lang}
            );
        });

        this.sections = this.layoutService.getAllSection();
        this.cdr.markForCheck();
    }
}
