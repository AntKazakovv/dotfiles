import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'wlc-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent implements OnInit {

  public lang: string = this.translate.currentLang;

  constructor(public translate: TranslateService) {}

  ngOnInit(): void {
  }

  public changeLanguage(lang: string): void {
    try {
      if (lang !== this.translate.currentLang) {
        this.translate.use(lang);
      }
    } catch (error) {
    }
  }
}
