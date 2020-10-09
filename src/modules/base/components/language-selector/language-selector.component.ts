import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    Inject,
    OnInit,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {find as _find} from 'lodash';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {ConfigService, ILanguage} from 'wlc-engine/modules/core';
import {defaultParams, ILSParams, AutoModifiersType, ModeType} from './language-selector.params';

@Component({
    selector: '[wlc-language-selector]',
    templateUrl: './language-selector.component.html',
    styleUrls: ['./styles/language-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectorComponent
    extends AbstractComponent
    implements OnInit {
    public $params: ILSParams;
    public availableLanguages: ILanguage[];
    public currentLanguage: ILanguage;

    constructor(
        public translate: TranslateService,
        @Inject('params') protected params: ILSParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected elementRef: ElementRef
    ) {
        super({params, defaultParams});
    }

    public ngOnInit(): void {
        this.availableLanguages = this.translate
            .getLangs()
            .filter(
                (lang: string): boolean => lang !== this.translate.currentLang
            )
            .map(
                (lang: string): ILanguage =>
                    _find(this.configService.appConfig.languages, {
                        code: lang,
                    })
            );
        this.currentLanguage = _find(this.configService.appConfig.languages, {
            code: this.translate.currentLang,
        });
        this.prepareParams();
    }

    public changeLanguage(lang: string, event: MouseEvent): void {
        event.preventDefault();
        try {
            if (lang !== this.translate.currentLang) {
                this.translate.use(lang);
            }
        } catch (error) {
            throw error;
        }
    }

    public getFlagUrl(lang: string): string {
        const replaceList = this.$params.common.flags.replace;
        return `${this.$params.common.flags.path}${replaceList[lang] || lang}.${
            this.$params.common.flags.dim
        }`;
    }

    public onImageError(name: string): void {
        // TODO add something for error logging.
    }

    @HostListener('document:click', ['$event'])
    protected clickHandler(event) {
        if (this.elementRef.nativeElement.contains(event.target)) {
            this.toggleModifiers('opened');
        } else {
            this.removeModifiers('opened');
        }
    }

    protected prepareParams(): void {
        const modifiers: AutoModifiersType[] = [];
        modifiers.push(this.$params.common.mode);

        if (this.$params.common.scrollable) {
            modifiers.push('scrollable');
        }

        if (this.$params.theme) {
            modifiers.push(this.$params.theme);
        }

        this.addModifiers(modifiers);
    }
}
