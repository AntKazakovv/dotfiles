import {
    LangChangeEvent,
    TranslateService,
} from '@ngx-translate/core';
import {
    Inject,
    Injectable,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {
    fromEvent,
    asyncScheduler,
    BehaviorSubject,
} from 'rxjs';
import {
    map,
    pairwise,
    throttleTime,
} from 'rxjs/operators';

import _forEach from 'lodash-es/forEach';
import _split from 'lodash-es/split';
import _startsWith from 'lodash-es/startsWith';
import _merge from 'lodash-es/merge';

import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {ActionService} from 'wlc-engine/modules/core/system/services/action/action.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {ColorThemeService} from 'wlc-engine/modules/core/system/services/color-theme/color-theme.service';

import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {DeviceType} from 'wlc-engine/modules/core/system/interfaces';
import {WINDOW} from 'wlc-engine/modules/app/system/tokens/window';
import {
    IFixedPanelConfig,
    TFixedPanelPos,
    TFixedPanelState,
    TFixedPanelStore,
} from 'wlc-engine/modules/core/system/interfaces/base-config/fixed-panel.interface';
import {TColorTheme} from 'wlc-engine/modules/core/system/interfaces/base-config/color-theme-switching.config';
import {StateService} from '@uirouter/core';

export enum BodyClassEvents {
    add = 'BODY_ADD_MODIFIER',
    remove = 'BODY_REMOVE_MODIFIER',
};

export enum BodyClassPrefix {
    lang = 'wlc-body--lang-',
    auth = 'wlc-body--auth-',
    theme = 'wlc-body--theme-',
    device = 'wlc-body--device-',
    os = 'wlc-body--os-',
    osVer = 'wlc-body--osver-',
    browser = 'wlc-body--browser-',
    country = 'wlc-body--country-',
    fixedPanel = 'wlc-body--fp-',
    pwa = 'wlc-body--pwa',
};

export type TBodyClassPrefix = keyof typeof BodyClassPrefix;

export enum ScrollingDirection {
    Up = 'Up',
    Down = 'Down',
    OnTop = 'OnTop',
};

@Injectable({providedIn: 'root'})
export class BodyClassService {

    private metaThemeColor: HTMLMetaElement = this.document.querySelector('meta[name="theme-color"]');
    private scrollStopPosition: number = 0;
    private scrollingGap: number;
    private stickyHeaderMobile: boolean;
    private bodyClassList: DOMTokenList = this.document.body.classList;
    private colorThemeService: ColorThemeService;
    private _fixedPanelConfig: IFixedPanelConfig;
    private _currFixedPanelBodyState: TFixedPanelStore = {};
    private _openedModalsCounter: number = 0;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        @Inject(WINDOW) protected window: Window,
        private injectionService: InjectionService,
        private configService: ConfigService,
        private eventService: EventService,
        private actionService: ActionService,
        private translateService: TranslateService,
        private logService: LogService,
        private stateService: StateService,
    ) {
        this.init();
    }

    /**
     * Add class to body element
     * @param modifier - class, recommended structure `wlc-body--{key}-{value}`
     * @param skipEvent - if `true` event won't be emitted
     */
    public addModifier(modifier: string, skipEvent: boolean = false): void {
        const modClass = this.replaceSpaces(modifier);
        try {
            this.bodyClassList.add(modClass);
            if (!skipEvent) {
                this.emitClassEvent(modClass, 'add');
            }
        } catch (error) {
            this.logService.sendLog({code: '0.8.0', data: error});
        }
    }

    /**
     * Replace body class by it's prefix
     * @param prefix - part of class which contains structure `wlc-body--{key}-`
     * @param newValue - new value for class `wlc-body--{key}-{newValue}`
     */
    public replaceModifier(prefix: TBodyClassPrefix, newValue: string): void {
        this.removeClassByPrefix(BodyClassPrefix[prefix]);
        this.addModifier(BodyClassPrefix[prefix] + newValue);
    }

    /**
     * Remove class from body by prefix
     * @param prefix - part of class which contains structure `wlc-body--{key}-`
     */
    public removeClassByPrefix(prefix: string): void {
        _forEach(_split(this.bodyClassList.value, ' '), (value: string) => {
            if (_startsWith(value, prefix)) {
                try {
                    this.bodyClassList.remove(value);
                    this.emitClassEvent(value, 'remove');
                } catch (error) {
                    this.logService.sendLog({code: '0.8.1', data: error});
                }
            }
        });
    }

    private async init(): Promise<void> {
        await this.configService.ready;
        this.addStaticClasses();
        this.initListeners();

        if (this.configService.get<boolean>('$base.stickyHeader.use')) {
            this.useStickyHeader();
        }

        if (this.configService.get<boolean>('$base.fixedPanel.use')) {
            this.initFixedPanel();
        }

        if (this.configService.get<boolean>('$base.colorThemeSwitching.use')) {
            this.colorThemeService =
                await this.injectionService.getService<ColorThemeService>('core.color-theme-service');
            this.initColorThemeSwitching();
        }
    }

    private initFixedPanel(): void {
        this._fixedPanelConfig = this.configService.get<IFixedPanelConfig>('$base.fixedPanel');

        this.configService.get<BehaviorSubject<TFixedPanelStore>>('fixedPanelStore$')
            .subscribe((store: TFixedPanelStore): void => {
                _forEach(store, (state: TFixedPanelState, pos: TFixedPanelPos) => {
                    this.addModifier(`${BodyClassPrefix.fixedPanel}${pos}`);
                    this.addFixedPanelClasses(pos, state);
                });
            });
    }

    private addFixedPanelClasses(pos: TFixedPanelPos, state?: TFixedPanelState): void {
        const panelConfig = this._fixedPanelConfig.panels[pos];
        const inClass = `${BodyClassPrefix.fixedPanel}${pos}-in`;
        const isCompactView = this.window.innerWidth < panelConfig.breakpoints.expand;

        if (this.window.innerWidth >= panelConfig.breakpoints.display) {
            const bodyState: TFixedPanelState = isCompactView ? 'compact' : state;

            this.removeClassByPrefix(`${BodyClassPrefix.fixedPanel}${pos}-${this._currFixedPanelBodyState[pos]}`);
            this.addModifier(`${BodyClassPrefix.fixedPanel}${pos}-${bodyState}`);
            this.addModifier(inClass);

            const currBodyState = _merge(
                this._currFixedPanelBodyState,
                {[pos]: bodyState},
            );
            this._currFixedPanelBodyState = currBodyState;

            if (isCompactView && !panelConfig.sizes.compact) {
                this.addModifier(`${BodyClassPrefix.fixedPanel}${pos}-nopadding`);
            } else {
                this.removeClassByPrefix(`${BodyClassPrefix.fixedPanel}${pos}-nopadding`);
            }
        } else {
            this.removeClassByPrefix(inClass);
        }
    }

    private fixBodyPadding(removePadding?: boolean): void {
        const bodyStyles = this.window.getComputedStyle(this.window.document.body);
        const hasBodyScroll = bodyStyles.getPropertyValue('overflow-y') !== 'hidden';

        if (removePadding) {
            if (this._openedModalsCounter > 0) {
                this._openedModalsCounter--;
            }
        } else {
            this._openedModalsCounter++;
        }

        if (hasBodyScroll && !removePadding) {
            const padding = this.window.innerWidth - this.document.documentElement.clientWidth + 'px';
            this.document.body.style.setProperty('--body-padding-overflow', padding);
            this.document.body.style.paddingRight = padding;
        }

        if (removePadding && !this._openedModalsCounter) {
            this.document.body.classList.remove('modal-open');
            this.document.body.style.removeProperty('overflow-y');
            this.document.body.style.setProperty('--body-padding-overflow', null);
            this.document.body.style.paddingRight = null;
        }
    }

    private addStaticClasses(): void {

        const country = this.configService.get<string>('appConfig.country');
        if (country) {
            this.addModifier(BodyClassPrefix.country + country, true);
        }

        const language = this.configService.get<string>('appConfig.language');
        if (language) {
            this.addModifier(BodyClassPrefix.lang + language, true);
        }

        this.addModifier(
            BodyClassPrefix.auth + (this.configService.get<boolean>('$user.isAuthenticated') ? '1' : '0'),
            true,
        );

        this.addModifier(BodyClassPrefix.os + this.actionService.device.osName, true);
        this.addModifier(BodyClassPrefix.browser + this.actionService.device.browserName, true);
        this.addModifier(BodyClassPrefix.device + this.actionService.getDeviceType(), true);

        if (this.actionService.device.osVersion) {
            this.addModifier(BodyClassPrefix.osVer + this.actionService.device.osVersion.replace('.', '-'), true);
        }
    }

    private initListeners(): void {
        this.configService.get<BehaviorSubject<boolean>>('$user.isAuth$')
            .subscribe((isAuth: boolean) => {
                this.replaceModifier('auth', isAuth ? '1' : '0');
            });

        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.replaceModifier('lang', event.lang);
        });

        this.actionService.deviceType().subscribe((deviceType: DeviceType) => {
            this.replaceModifier('device', deviceType);
        });

        this.eventService.subscribe([
            {name: 'modalOpened'},
            {name: 'PANEL_OPEN'},
        ], () => {
            this.fixBodyPadding();
        });

        this.eventService.subscribe([
            {name: 'modalClosed'},
            {name: 'PANEL_CLOSE'},
        ], () => {
            this.fixBodyPadding(true);
        });

        this.setMetaThemeColor();

        this.pwaListeners();
    }

    private pwaListeners(): void {
        const matchMedia = this.window.matchMedia('(display-mode: standalone)');

        if (matchMedia.matches) {
            this.addModifier(BodyClassPrefix.pwa, true);
        }

        matchMedia.addEventListener('change', (evt) => {
            if (evt.matches) {
                this.addModifier(BodyClassPrefix.pwa, true);
            } else {
                this.removeClassByPrefix(BodyClassPrefix.pwa);
            }

            this.stateService.reload();
        });
    }

    private setMetaThemeColor(): void {
        if (!this.metaThemeColor) {
            return;
        }
        this.metaThemeColor.content = getComputedStyle(this.document.body).getPropertyValue('--mc-bg') || '#000000';
    }

    private initColorThemeSwitching(): void {
        this.colorThemeService.appColorTheme$.subscribe((theme: TColorTheme) => {
            this.removeClassByPrefix(BodyClassPrefix.theme);
            this.addModifier(BodyClassPrefix.theme + theme);

            setTimeout(() => {
                this.setMetaThemeColor();
            }, 0);
        });
    }

    private emitClassEvent(className: string, action: keyof typeof BodyClassEvents): void {
        this.eventService.emit({
            name: BodyClassEvents[action],
            from: 'BodyClassService',
            data: {className},
        });
    }

    private replaceSpaces(str: string): string {
        return str.replace(/\s+|\s/g, '-');
    }

    private useStickyHeader(): void {
        this.addModifier('wlc-body--sticky-header');
        this.scrollingGap = this.configService.get('$base.stickyHeader.scrollingGap');
        this.stickyHeaderMobile = this.configService.get<boolean>('$base.stickyHeader.stickyMobile');

        fromEvent(this.window, 'scroll').pipe(
            throttleTime(10, asyncScheduler, {leading: false, trailing: true}),
            map((): number => this.window.pageYOffset),
            pairwise(),
            map(([y1, y2]: number[]): ScrollingDirection => {
                if (y2 <= 0) {
                    return ScrollingDirection.OnTop;
                }
                return y2 < y1 ? ScrollingDirection.Up : ScrollingDirection.Down;
            }),
        ).subscribe((value: ScrollingDirection) => {
            this.addModifier('wlc-body--sticky-header-scrolling');

            switch (value) {
                case ScrollingDirection.OnTop:
                    this.removeClassByPrefix('wlc-body--sticky-header-down');
                    this.removeClassByPrefix('wlc-body--sticky-header-scrolling');
                    break;
                case ScrollingDirection.Up:
                    if ((this.scrollStopPosition - this.window.pageYOffset) > this.scrollingGap) {
                        this.removeClassByPrefix('wlc-body--sticky-header-down');
                        this.scrollStopPosition = this.window.pageYOffset;
                    }
                    break;
                case ScrollingDirection.Down:
                    if ((this.window.pageYOffset - this.scrollStopPosition) > this.scrollingGap) {
                        if (!this.stickyHeaderMobile) {
                            this.addModifier('wlc-body--sticky-header-down');
                        }
                        this.scrollStopPosition = this.window.pageYOffset;
                    }
                    break;
            }
        });
    }
}
