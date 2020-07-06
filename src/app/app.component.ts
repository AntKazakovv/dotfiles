import {Component, OnInit, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UIRouter, StateService} from '@uirouter/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ConfigService, LayoutService} from '../modules/core/services';

@Component({
    selector: '[app-component]',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    public sections: string[] = [];
    private $destroy = new Subject<null>();

    constructor(
        router: UIRouter,
        configService: ConfigService,
        private translate: TranslateService,
        private stateService: StateService,
        private layoutService: LayoutService,
    ) {
        const currentLang = router.stateService.params?.locale || 'en';
        translate.addLangs(configService.appConfig.languages.map((lang) => lang.code));
        translate.setDefaultLang(currentLang);
        translate.use(currentLang);
    }

    async ngOnInit(): Promise<void> {
        this.translate.onLangChange.pipe(takeUntil(this.$destroy)).subscribe((v) => {
            this.stateService.go(
                this.stateService.current.name,
                {locale: v.lang}
            );
        });

        this.sections = await this.layoutService.getAllSection();
    }

    ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }
}
