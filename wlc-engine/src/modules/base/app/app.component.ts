import {Component, OnInit, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {StateService} from '@uirouter/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'wlc-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private $destroy = new Subject<null>();

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private stateService: StateService,
  ) {
    translate.addLangs(['en', 'ru']);
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.translate.onLangChange.pipe(takeUntil(this.$destroy)).subscribe((v) => {
      this.stateService.go(
        this.stateService.current.name,
        {locale: v.lang}
      );
    });
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

}
