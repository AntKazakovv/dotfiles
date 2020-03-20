import { Component, LOCALE_ID, Inject, OnInit, Renderer2 } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'wlcengine';

    languageList = [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'हिंदी' },
        { code: 'es', label: 'Espanol' }
    ];

    constructor(
        @Inject(LOCALE_ID) protected localeId: string,
        private renderer: Renderer2,
    ) {

    }

    ngOnInit() {
        this.renderer.removeChild(document.body, document.getElementById('wlc-main-loader'));
    }
}
