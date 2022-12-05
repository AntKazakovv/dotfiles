import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    OnInit,
    AfterViewInit,
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
    BehaviorSubject,
    fromEvent,
    merge,
} from 'rxjs';
import {
    distinctUntilChanged,
    takeUntil,
    throttleTime,
    map,
} from 'rxjs/operators';
import _find from 'lodash-es/find';

import {
    ConfigService,
    ILanguage,
    ModalService,
    AbstractComponent,
    LogService,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './language-selector.params';

import {TFixedPanelState} from 'wlc-engine/modules/core/system/interfaces/base-config/fixed-panel.interface';

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
            state('closedFade', style({
                opacity: 0,
                transform: 'translate(-50%) scale(0.95)',
                pointerEvents: 'none',
            })),
            state('openedFade', style({
                opacity: 1,
                transform: '*',
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
                animate('0.15s'),
            ]),
        ]),
    ],
})
export class LanguageSelectorComponent
    extends AbstractComponent
    implements OnInit, AfterViewInit {
    @ViewChild('langList') langListRef: TemplateRef<any>;
    @ViewChild('dropdown') dropdownRef: ElementRef<HTMLElement>;
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
        @Inject(WINDOW) private window: Window,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        if (this.$params.currentLang?.hideLang === false) {
            this.addModifiers('border-around');
        }

        let availableLanguageNames: string[] = this.translate.getLangs();

        if (availableLanguageNames.length <= 6) {
            availableLanguageNames = availableLanguageNames.filter(
                (lang: string): boolean => {
                    if (this.$params.themeMod === 'long') {
                        return lang !== this.translate.currentLang;
                    }
                    return true;
                },
            );
        }

        this.availableLanguages = GlobalHelper.sortByOrder<ILanguage, string>(
            availableLanguageNames.map(this.findLanguage.bind(this)),
            this.$params.order,
            'code',
        );
        this.currentLanguage = this.findLanguage(this.translate.currentLang);

        if (this.languagesCount() <= 1) {
            this.hasSingleLang = true;
        } else if (this.availableLanguages.length <= 6 && this.$params.toggleOnScroll) {
            this.defaultThemeMod = this.$params.themeMod;
            merge(
                fromEvent(this.window, 'scroll'),
                fromEvent(this.window, 'resize'),
            ).pipe(takeUntil(this.$destroy)).subscribe(() => {
                this.toggleThemeMod();
            });
        }
    }

    public ngAfterViewInit(): void {
        if (this.$params.compactMod) {
            this.initCompactMod();
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

    public animationState(): string {
        let state = this.isOpened ? 'opened' : 'closed';

        if (this.$params.themeMod === 'long') {
            if (this.$params.compactMod) {
                state = this.isOpened ? 'openedFade' : 'closedFade';
            } else {
                state = this.isOpened ? 'openedHeight' : 'closedHeight';
            }
        }

        return state;
    }

    public getFlagUrl(lang: string): string {
        const replaceList = this.$params.common.flags.replace;
        const path = `${this.$params.common.flags.path}${replaceList[lang] || lang}.${this.$params.common.flags.dim}`;
        return GlobalHelper.proxyUrl(path);
    }

    public imageError(langCode: string): void {
        this.logService.sendLog({code: '0.7.0', data: {langCode}});
    }

    public toggle(): void {
        if (this.hasSingleLang) {
            return;
        } else if (this.availableLanguages.length <= 6) {

            if (this.$params.compactMod && !this.isOpened) {
                this.setDropdownPosition();
            }

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

    protected initCompactMod(): void {
        this.addModifiers('compact');
        this.setDropdownPosition();

        this.configService.get<BehaviorSubject<TFixedPanelState>>('fixedPanelState$')?.pipe(
            distinctUntilChanged(),
            map((state: TFixedPanelState): boolean => state === 'compact'),
            takeUntil(this.$destroy),
        ).subscribe((isCompact: boolean) => {
            this.updateCompactState(isCompact);
        });

        fromEvent(this.window, 'resize')
            .pipe(
                throttleTime(150, null, {leading: false, trailing: true}),
                takeUntil(this.$destroy),
            )
            .subscribe(() => this.setDropdownPosition());
    }

    protected updateCompactState(isCompact: boolean): void {
        let useTooltip: boolean = false;
        const currentLangConfig: Params.ICurrentLangCParams = {
            hideLang: isCompact,
            hideArrow: isCompact,
        };

        const dropdownConfig: Params.ILanguageSelectorDropdownСParams = {
            hideFlag: false,
            hideLang: isCompact,
        };

        if (isCompact) {
            this.addModifiers('state-compact');
            useTooltip = true;
        } else {
            this.removeModifiers('state-compact');
        }

        this.$params.currentLang = currentLangConfig;
        this.$params.dropdown = dropdownConfig;
        this.$params.useTooltip = useTooltip;
        this.cdr.markForCheck();
    }

    protected setDropdownPosition(): void {
        if (this.elementRef && this.dropdownRef) {

            const parentBox: DOMRect = this.elementRef.nativeElement.getBoundingClientRect();
            const dropdownHeight: number = this.dropdownRef.nativeElement.getBoundingClientRect().height;

            if (this.window.innerHeight - parentBox.top - parentBox.height - dropdownHeight > 0) {
                this.addModifiers('dropdown-bottom');
            } else {
                this.removeModifiers('dropdown-bottom');
            }
        }
    }
}
