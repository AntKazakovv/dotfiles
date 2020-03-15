import {Component, LOCALE_ID, Inject, ViewEncapsulation} from '@angular/core';
import {DataService} from 'modules/core/data/services/data/data.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    title = 'Home component';

    languageList = [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'हिंदी' },
        { code: 'es', label: 'Espanol' },
        { code: 'tr', label: 'Turkish', locale: 'tr_TR'}
    ];

    constructor(
        @Inject(LOCALE_ID) protected localeId: string,
        private DataService: DataService,
        translate: TranslateService
    ) {
        // console.log(DataService.testRequest());
    }
}
