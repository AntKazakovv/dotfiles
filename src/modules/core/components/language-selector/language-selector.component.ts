import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    OnInit,
    Input,
    ViewChild,
    TemplateRef,
    HostListener,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import {
    ConfigService,
    ILanguage,
    ModalService,
    AbstractComponent,
    LogService,
} from 'wlc-engine/modules/core';
import * as Params from './language-selector.params';
import {
    fromEvent,
    merge,
} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import _find from 'lodash-es/find';

export {ILanguageSelectorCParams} from './language-selector.params';

@Component({
    selector: '[wlc-language-selector]',
    templateUrl: './language-selector.component.html',
    styleUrls: ['./styles/language-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('toggle', [
            state('openedHeight', style({
                height: '*',
            })),
            state('closedHeight', style({
                height: 0,
                pointerEvents: 'none',
            })),
            state('opened', style({
                opacity: 1,
                visibility: 'visible',
            })),
            state('closed', style({
                opacity: 0,
                visibility: 'hidden',
                pointerEvents: 'none',
            })),
            transition('void => *', [
                animate(0),
            ]),
            transition('* => *', [
                animate('0.2s'),
            ]),
        ]),
    ],
})
export class LanguageSelectorComponent
    extends AbstractComponent
    implements OnInit {
    @ViewChild('langList') langListRef: TemplateRef<any>;
    public $params: Params.ILanguageSelectorCParams;
    public availableLanguages: ILanguage[];
    public currentLanguage: ILanguage;
    public isOpened: boolean;
    public isModalOpen: boolean;
    public hasSingleLang: boolean = false;

    private modToggled: boolean = false;
    private defaultThemeMod: 'default' | Params.ThemeModType;

    @Input() protected inlineParams: Params.ILanguageSelectorCParams;

    constructor(
        public translate: TranslateService,
        @Inject('injectParams') protected injectParams: Params.ILanguageSelectorCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected elementRef: ElementRef,
        protected modalService: ModalService,
        protected logService: LogService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        if (this.$params.currentLang?.hideLang === false) {
            this.addModifiers('border-around');
        }
        this.availableLanguages = this.translate
            .getLangs()
            .filter(
                (lang: string): boolean => {
                    if (this.$params.themeMod === 'long') {
                        return lang !== this.translate.currentLang;
                    }
                    return true;
                },
            )
            .map(this.findLanguage.bind(this));
        this.currentLanguage = this.findLanguage(this.translate.currentLang);

        if (this.languagesCount() <= 1) {
            this.hasSingleLang = true;
        } else if (this.availableLanguages.length <= 6 && this.$params.toggleOnScroll) {
            this.defaultThemeMod = this.$params.themeMod;
            merge(
                fromEvent(window, 'scroll'),
                fromEvent(window, 'resize'),
            ).pipe(takeUntil(this.$destroy)).subscribe(() => {
                this.toggleThemeMod();
            });
        }
    }

    public changeLanguage(lang: string, event: MouseEvent): void {
        event.preventDefault();
        try {
            if (lang !== this.translate.currentLang) {
                this.translate.use(lang)
                    .pipe(takeUntil(this.$destroy))
                    .subscribe(() => {
                        this.configService.set({name: 'currentLanguage', value: this.translate.currentLang});
                        if (this.isModalOpen) {
                            this.modalService.hideModal('langSwitcherRef');
                        }
                    });
            }
        } catch (error) {
            //
        }
    }

    public getFlagUrl(lang: string): string {
        const replaceList = this.$params.common.flags.replace;
        return `${this.$params.common.flags.path}${replaceList[lang] || lang}.${this.$params.common.flags.dim}`;
    }

    public imageError(langCode: string): void {
        this.logService.sendLog({code: '0.7.0', data: {langCode}});
    }

    public toggle(): void {
        if (this.hasSingleLang) {
            return;
        } else if (this.availableLanguages.length <= 6 || this.$params.themeMod === 'long') {
            this.isOpened = !this.isOpened;
        } else {
            this.modalService.showModal({
                id: 'langSwitcherRef',
                templateRef: this.langListRef,
                modalTitle: gettext('Choose your language'),
                closeBtnParams: {
                    themeMod: 'secondary',
                    common: {
                        text: gettext('Close'),
                    },
                },
                onModalShow: () => {
                    this.isModalOpen = true;
                    this.cdr.markForCheck();
                },
                onModalHide: () => {
                    this.isModalOpen = false;
                    this.cdr.markForCheck();
                },
                modifier: 'type-lang',
                templateRefParams: {
                    list: this.translate
                        .getLangs()
                        .map(this.findLanguage.bind(this)),
                    class: 'wlc-language-modal',
                },
            });
        }
    }

    @HostListener('document:mousedown', ['$event'])
    protected outsideClick(event: MouseEvent): void {
        if (
            (this.availableLanguages.length <= 6 || this.$params.themeMod === 'long')
            && this.isOpened
            && !this.elementRef.nativeElement.contains(event.target)
        ) {
            this.isOpened = !this.isOpened;
            this.cdr.markForCheck();
        }
    }

    protected toggleThemeMod(): void {
        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        if ((rect.top > 200 && this.modToggled) || (rect.top <= 200 && !this.modToggled)) {
            this.modToggled = !this.modToggled;
            if (this.modToggled) {
                this.$params.themeMod = this.$params.toggleOnScroll;
                this.removeModifiers('theme-mod-' + this.defaultThemeMod);
            } else {
                this.$params.themeMod = this.defaultThemeMod;
                this.removeModifiers('theme-mod-' + this.$params.toggleOnScroll);
            }
            this.prepareHostClass();
        }
    }

    protected findLanguage(lang: string): ILanguage {
        return _find(this.configService.get<ILanguage[]>('appConfig.languages'), {
            code: lang,
        });
    }

    protected languagesCount(): number {
        const isInclude = !!_find(this.availableLanguages, ({code}) => this.currentLanguage.code === code);

        return isInclude
            ? this.availableLanguages.length
            : this.availableLanguages.length + 1;
    }
}
