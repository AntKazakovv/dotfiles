import {
    ChangeDetectionStrategy,
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
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';

import {TranslateService} from '@ngx-translate/core';
import {
    Observable,
    fromEvent,
    merge,
} from 'rxjs';
import {
    takeUntil,
    throttleTime,
} from 'rxjs/operators';
import _find from 'lodash-es/find';
import _isNil from 'lodash-es/isNil';
import _merge from 'lodash-es/merge';

import {
    ILanguage,
    ModalService,
    AbstractComponent,
    LogService,
    GlobalHelper,
    ActionService,
    DeviceType,
} from 'wlc-engine/modules/core';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {CoreModule} from 'wlc-engine/modules/core/core.module';

import * as Params from './language-selector.params';

import {
    TFixedPanelStore,
} from 'wlc-engine/modules/core/system/interfaces/base-config/fixed-panel.interface';
import {CustomHook} from 'wlc-engine/modules/core/system/decorators/hook.decorator';

export {ILanguageSelectorCParams} from './language-selector.params';

@Component({
    selector: '[wlc-language-selector]',
    templateUrl: './language-selector.component.html',
    styleUrls: ['./styles/language-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CoreModule,
    ],
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
                height: '*',
                opacity: 1,
                visibility: 'visible',
            })),
            state('closed', style({
                height: 0,
                opacity: 0,
                visibility: 'hidden',
                pointerEvents: 'none',
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
    implements OnInit, AfterViewInit {
    @ViewChild('langList') langListRef: TemplateRef<any>;
    @ViewChild('dropdown') protected dropdownRef!: ElementRef<HTMLElement>;
    @ViewChild('langContainer') protected langContainer!: ElementRef;
    public override $params: Params.ILanguageSelectorCParams;
    public availableLanguages: ILanguage[];
    public currentLanguage: ILanguage;
    public isOpened: boolean;
    public isModalOpen: boolean;
    public hasSingleLang: boolean = false;
    public isDropdownAtTop: boolean = false;

    protected modToggled: boolean = false;
    protected defaultThemeMod: 'default' | Params.ThemeModType;

    @Input() protected inlineParams: Params.ILanguageSelectorCParams;

    constructor(
        public translateService: TranslateService,
        @Inject('injectParams') protected injectParams: Params.ILanguageSelectorCParams,
        protected elementRef: ElementRef,
        protected modalService: ModalService,
        protected logService: LogService,
        protected actionService: ActionService,
        @Inject(WINDOW) private window: Window,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        if (this.$params.currentLang?.hideLang === false) {
            this.addModifiers('border-around');
        }

        let availableLanguageNames: string[] = this.translateService.getLangs();

        if (availableLanguageNames.length <= this.$params.countLangFromDropdown) {
            availableLanguageNames = availableLanguageNames.filter(
                (lang: string): boolean => {
                    if (this.isLongThemeMod) {
                        return lang !== this.translateService.currentLang;
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

        this.currentLanguage = this.findLanguage(this.translateService.currentLang);

        if (this.languagesCount() <= 1) {
            this.hasSingleLang = true;
        } else if (this.isShowLangByDropdown && this.$params.toggleOnScroll) {
            this.defaultThemeMod = this.$params.themeMod;
            merge(
                fromEvent(this.window, 'scroll'),
                fromEvent(this.window, 'resize'),
            ).pipe(takeUntil(this.$destroy)).subscribe(() => {
                this.toggleThemeMod();
            });
        }

        this.setDropdownModifier();
    }

    public ngAfterViewInit(): void {
        if (this.$params.compactMod) {
            this.initCompactMod();
        }
    }

    public changeLanguage(lang: string, event: MouseEvent): void {
        event.preventDefault();
        try {
            if (lang !== this.translateService.currentLang) {
                this.translateService.use(lang)
                    .pipe(takeUntil(this.$destroy))
                    .subscribe(() => {
                        this.configService.set({name: 'currentLanguage', value: this.translateService.currentLang});

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
        } else if (this.isShowLangByDropdown) {
            if (this.$params.compactMod && !this.isOpened) {
                this.setDropdownPosition();
            }

            this.isDropdownAtTop = this.shouldLangListBeShownAtTop();
            this.isOpened = !this.isOpened;
        } else {
            this.modalService.showModal({
                id: 'langSwitcherRef',
                templateRef: this.langListRef,
                modalTitle: gettext('Select a language'),
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
                    list: this.translateService
                        .getLangs()
                        .map(this.findLanguage.bind(this)),
                    class: 'wlc-language-modal',
                },
            });
        }
    }

    /**
     * Specifies whether to show langList as a dropdown.
     *
     * @returns {boolean} - is show by dropdown.
     */
    public get isShowLangByDropdown(): boolean {
        return this.availableLanguages.length <= this.$params.countLangFromDropdown;
    }

    public get isShowLangByThemeWolf(): boolean {
        return !_isNil(this.$params.dropdown?.expandableOnHover);
    }

    /**
     * Checks themeMod parameter, returns true if it is 'long'.
     *
     * @returns {boolean} - 'long' themeMod or not.
     */
    public get isLongThemeMod(): boolean {
        return this.$params.themeMod === 'long';
    }

    /**
     * Returns state by themeMod for dropdown langList.
     *
     * @returns {string} - state.
     */
    public get getStateByTheme(): string {
        if (this.isLongThemeMod) {
            return this.isOpened ? 'openedHeight' : 'closedHeight';
        } else {
            return this.isOpened ? 'opened' : 'closed';
        }
    }

    protected setDropdownModifier(): void {
        let modifier: string;
        if (!this.$params.currentLang?.hideArrow && this.$params.currentLang?.hideLang){
            modifier = 'dropdown-with-arrow';
        }

        this.addModifiers(modifier);
    }


    /**
     * Сalculates whether to display the langList on top.
     *
     * @returns {boolean} - display / not display the langList element on top.
     *
     * @privateRemarks (!this.isDropdownAtTop && this.isOpened) - the state when dropDown is open and not on top,
     * because of this, its langContainerBottom change and an artifact occurs in the animation.
     */
    protected shouldLangListBeShownAtTop(): boolean {
        const langListHeight: number = this.computeAvailableLanguagesHeight(this.availableLanguages.length);
        const langContainerBottom: number = this.langContainer.nativeElement.getBoundingClientRect().bottom;
        const freeBottomSpace: number = this.window.innerHeight - langContainerBottom;

        return freeBottomSpace < langListHeight && !(!this.isDropdownAtTop && this.isOpened);
    }

    /**
     * Returns the approximate height of the block with the list of languages.
     * Approximate, because we can't find out the exact height of the block until the dropdown animation is over.
     *
     * @param {number} langsCount - count of languages ​​in the list.
     * @returns {number} - the height of the element with the list of languages.
     *
     * @throws An exception is thrown if the received number does not fit the required range.
     */
    protected computeAvailableLanguagesHeight(langsCount: number): number {
        if (langsCount >= 1 && langsCount <= this.$params.countLangFromDropdown) {
            return this.$params.itemLangHeight * (1 + langsCount);
        } else {
            throw new Error(`Number not in range 1..${this.$params.countLangFromDropdown}`);
        }
    }

    @HostListener('document:mousedown', ['$event'])
    protected outsideClick(event: MouseEvent): void {
        if (
            (this.isShowLangByDropdown || this.isLongThemeMod)
            && this.isOpened
            && !this.elementRef.nativeElement.contains(event.target)
            && this.$params.outsideClickHandler
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

    @CustomHook('core', 'languageSelectorComponentFindLanguage')
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

        this.configService.get<Observable<[DeviceType, TFixedPanelStore]>>('changesFixedPanel$')
            ?.pipe(takeUntil(this.$destroy))
            .subscribe((value: [DeviceType, TFixedPanelStore]) => {
                const isCompact: boolean = value[1][this.$params.fixedPanelPosition] === 'compact';
                const isMobile = value[0] !== DeviceType.Desktop;

                if (isCompact && !isMobile) {
                    this.isOpened = false;
                }

                this.updateCompactState(isCompact ? isCompact && !isMobile : isCompact);
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

        const dropdownConfig: Params.ILanguageSelectorDropdownCParams = {
            hideFlag: false,
            hideLang: isCompact,
        };

        if (this.$params.theme === 'wolf') {
            dropdownConfig.expandableOnHover = isCompact;
        }

        if (isCompact) {
            this.removeModifiers('state-expanded');
            this.addModifiers('state-compact');

            if (!this.isShowLangByDropdown) {
                useTooltip = true;
            }
        } else {
            this.removeModifiers('state-compact');
            this.addModifiers('state-expanded');
        }

        this.$params.currentLang = _merge({}, this.$params.currentLang, currentLangConfig);
        this.$params.dropdown = dropdownConfig;
        this.$params.useTooltip = useTooltip;
        this.cdr.detectChanges();
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
