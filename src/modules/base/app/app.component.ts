import {Component, OnInit, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {UIRouter, StateService} from '@uirouter/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DataService, ConfigService} from '../../core/services';

@Component({
  selector: 'wlc-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  public sections: string[] = [];
  private $destroy = new Subject<null>();

  constructor(
    private data: DataService,
    private router: UIRouter,
    private translate: TranslateService,
    private stateService: StateService,
    private configService: ConfigService,
  ) {
    const currentLang = router.stateService.params?.locale || 'en';
    translate.addLangs(configService.get('languages').map((lang) => lang.code));
    translate.setDefaultLang(currentLang);
    translate.use(currentLang);
  }

  ngOnInit(): void {
    this.translate.onLangChange.pipe(takeUntil(this.$destroy)).subscribe((v) => {
      this.stateService.go(
        this.stateService.current.name,
        {locale: v.lang}
      );
    });

    this.sections = this.configService.get('siteconfig').sections;
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

}
