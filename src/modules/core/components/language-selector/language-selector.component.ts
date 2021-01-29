import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    OnInit,
    Input,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService, ILanguage} from 'wlc-engine/modules/core';
import * as Params from './language-selector.params';

import {
    find as _find,
} from 'lodash-es';

export {ILanguageSelectorCParams} from './language-selector.params';

@Component({
    selector: '[wlc-language-selector]',
    templateUrl: './language-selector.component.html',
    styleUrls: ['./styles/language-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('toggle', [
            state('opened', style({
                opacity: 1,
                visibility: 'visible',
            })),
            state('closed', style({
                opacity: 0,
                visibility: 'hidden',
            })),
            transition('void => *', [
                animate(0),
            ]),
            transition('* => *', [
                animate('0.3s'),
            ]),
        ]),
    ],
})
export class LanguageSelectorComponent
    extends AbstractComponent
    implements OnInit {
    public $params: Params.ILanguageSelectorCParams;
    public availableLanguages: ILanguage[];
    public currentLanguage: ILanguage;
    public isOpened: boolean;

    @Input() protected inlineParams: Params.ILanguageSelectorCParams;

    constructor(
        public translate: TranslateService,
        @Inject('injectParams') protected injectParams: Params.ILanguageSelectorCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected elementRef: ElementRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.availableLanguages = this.translate
            .getLangs()
            .filter(
                (lang: string): boolean => lang !== this.translate.currentLang,
            )
            .map(
                (lang: string): ILanguage =>
                    _find(this.configService.get<ILanguage[]>('appConfig.languages'), {
                        code: lang,
                    }),
            );
        this.currentLanguage = _find(this.configService.get<ILanguage[]>('appConfig.languages'), {
            code: this.translate.currentLang,
        });
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

    public toggle(): void {
        this.isOpened = !this.isOpened;
    }
}
