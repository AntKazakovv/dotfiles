import {
    LangChangeEvent,
    TranslateService,
} from '@ngx-translate/core';
import {DOCUMENT} from '@angular/common';
import {
    Inject,
    Injectable,
} from '@angular/core';

import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {ActionService} from 'wlc-engine/modules/core/system/services/action/action.service';
import {ColorThemeValues} from 'wlc-engine/modules/core/constants';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {DeviceType} from 'wlc-engine/modules/core/system/interfaces';

import _forEach from 'lodash-es/forEach';
import _split from 'lodash-es/split';
import _startsWith from 'lodash-es/startsWith';

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
    browser = 'wlc-body--browser-',
    country = 'wlc-body--country-',
};

export type TBodyClassPrefix = keyof typeof BodyClassPrefix;

@Injectable({providedIn: 'root'})
export class BodyClassService {

    private metaThemeColor: HTMLMetaElement = this.document.querySelector('meta[name="theme-color"]');

    constructor(
        @Inject(DOCUMENT) private document: HTMLDocument,
        private configService: ConfigService,
        private eventService: EventService,
        private actionService: ActionService,
        private translateService: TranslateService,
        private logService: LogService,
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
            this.document.body.classList.add(modClass);
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
        const bodyClassList = this.document.body.classList;
        _forEach(_split(bodyClassList.value, ' '), (value: string) => {
            if (_startsWith(value, prefix)) {
                try {
                    bodyClassList.remove(value);
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

    }

    private initListeners(): void {
        this.eventService.subscribe({name: 'LOGOUT'}, () => {
            this.replaceModifier('auth', '0');
        });

        this.eventService.subscribe({name: 'LOGIN'}, () => {
            this.replaceModifier('auth', '1');
        });

        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.replaceModifier('lang', event.lang);
        });

        this.actionService.deviceType().subscribe((deviceType: DeviceType) => {
            this.replaceModifier('device', deviceType);
        });

        this.setMetaThemeColor();

        if (this.configService.get<boolean>('$base.colorThemeSwitching.use')) {
            this.colorThemeSwitching();
        }
    }

    private setMetaThemeColor(): void {
        if (!this.metaThemeColor) {
            return;
        }
        this.metaThemeColor.content = getComputedStyle(this.document.body).getPropertyValue('--mc-bg') || '#000000';
    }

    private colorThemeSwitching(): void {
        this.eventService.subscribe(
            {name: ColorThemeValues.changeEvent},
            (status: boolean) => {
                if (status) {
                    this.addModifier(
                        BodyClassPrefix.theme +
                        this.configService.get<string>(ColorThemeValues.configName),
                    );
                } else {
                    this.removeClassByPrefix(BodyClassPrefix.theme);
                }
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
}
