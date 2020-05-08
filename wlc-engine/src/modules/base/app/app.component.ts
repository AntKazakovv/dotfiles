import {Component, OnInit, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {UIRouter, StateService} from '@uirouter/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DataService} from '../../core/services';

@Component({
  selector: 'wlc-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private $destroy = new Subject<null>();

  constructor(
    private data: DataService,
    private router: UIRouter,
    private translate: TranslateService,
    private stateService: StateService,
  ) {
    const currentLang = router.stateService.params?.locale || 'en';
    translate.addLangs(['en', 'ru']);
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

   // this.data.request({
    //   name: 'bootstrap',
    //   system: 'main',
    //   type: 'GET',
    //   url: '/api/v1/bootstrap',
    // }).subscribe((data) => {
    //   console.log(data);
    // });
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

}
