import {Component, OnInit,  OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {StateService} from '@uirouter/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'wlc-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit, OnDestroy {

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
      console.log('lang change', v.lang, this.stateService.current);
      this.stateService.go(
        this.stateService.current.name,
        {locale: v.lang}
      );
    });

    this.http.get('/api/v1/bootstrap').pipe(takeUntil(this.$destroy)).subscribe((data: any) => {
      console.log(data);
    });
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
