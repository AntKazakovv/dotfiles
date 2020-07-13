import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    OnDestroy,
    HostBinding
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UIRouter, StateService} from '@uirouter/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ConfigService, LayoutService} from '../modules/core/services';

@Component({
    selector: '[app-component]',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
    @HostBinding('class') hostClass = 'wlc-sections';

    public sections: string[] = [];
    private $destroy = new Subject<null>();

    constructor(
        router: UIRouter,
        configService: ConfigService,
        private translate: TranslateService,
        private stateService: StateService,
        private layoutService: LayoutService,
        private cdr: ChangeDetectorRef,
    ) {
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
        this.cdr.detectChanges();
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    public getSectionClass(sectionName: string): string {
        return '';
    }
}
