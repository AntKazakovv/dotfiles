import {Component, LOCALE_ID, Inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StateService} from '@uirouter/core';

@Component({
  selector: 'wlc-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {

    constructor(
        @Inject(LOCALE_ID) protected localeId: string,
        private translate: TranslateService,
        private stateService: StateService
    ) {
        this.setLanguage();
    }

    private setLanguage(): void {
        this.translate.setDefaultLang('en');

        const params = this.stateService.params;
        if (params.locale) {
            this.translate.use(params.locale);
        }
    }
}
