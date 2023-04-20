import {
    Inject,
    Injectable,
} from '@angular/core';
import {Meta} from '@angular/platform-browser';

import {first} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';

import {
    UserService,
    UserProfile,
} from 'wlc-engine/modules/user';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {ColorThemeValues} from 'wlc-engine/modules/core/constants/color-theme.constants';
import {
    IColorThemeSwitchingConfig,
    TBrowserColorScheme,
    TColorTheme,
} from 'wlc-engine/modules/core/system/interfaces/base-config/color-theme-switching.config';
import {WINDOW} from 'wlc-engine/modules/app/system/tokens/window';

@Injectable({
    providedIn: 'root',
})
export class ColorThemeService {

    public appColorTheme$: BehaviorSubject<TColorTheme> = new BehaviorSubject(null);

    private config: IColorThemeSwitchingConfig;
    private userService: UserService;

    constructor(
        @Inject(WINDOW) protected window: Window,
        private configService: ConfigService,
        private injectionService: InjectionService,
        private eventService: EventService,
        private logService: LogService,
        private meta: Meta,
    ) {
        this.init();
    }

    /**
     * Switch color theme
     *
     * @param {boolean} needToSave - if true, color theme will saved to localstore and profile (for authorized users)
     */
    public toggleColorTheme(needToSave: boolean): void {
        const theme = this.appColorTheme$.getValue() === 'default' ? 'alt' : 'default';
        this.appColorTheme$.next(theme);

        this.colorThemeChangeHandler(theme, needToSave);
    }

    private init(): void {
        this.config = {
            altName: ColorThemeValues.altThemeName,
            ...this.configService.get<IColorThemeSwitchingConfig>('$base.colorThemeSwitching'),
        };

        this.initListeners();

        const localStorageTheme = this.configService.get<TColorTheme>({
            name: ColorThemeValues.localStoreName,
            storageType: 'localStorage',
        });

        if (this.configService.get<boolean>('$user.isAuthenticated')) {
            this.loginHandler();
        }

        let theme: TColorTheme = localStorageTheme || 'default';

        if (this.config.usePrefersColorScheme && !localStorageTheme) {
            const projectColorScheme: TBrowserColorScheme = this.config.defaultProjectColorScheme || 'light';

            theme = this.window.matchMedia(`(prefers-color-scheme: ${projectColorScheme})`).matches ? 'default' : 'alt';
        }

        this.appColorTheme$.next(theme);
    }

    private initListeners(): void {

        this.eventService.subscribe({name: 'LOGIN'}, () => {
            this.loginHandler();
        });
    }

    private colorThemeChangeHandler(theme: TColorTheme, needToSave: boolean = false): void {

        this.configService.set({
            name: ColorThemeValues.configName,
            value: theme,
        });

        if (this.config.metaColorConfig) {
            this.meta.updateTag({
                name: ColorThemeValues.tagName,
                content: theme === 'alt'
                    ? this.config.metaColorConfig.alt || ColorThemeValues.defThemeColor
                    : this.config.metaColorConfig.default || ColorThemeValues.defThemeColor,
            });
        }

        if (needToSave) {
            this.configService.set({
                name: ColorThemeValues.localStoreName,
                value: theme,
                storageType: 'localStorage',
            });

            if (this.configService.get<boolean>('$user.isAuthenticated')) {
                this.saveColorThemeToProfile(theme);
            }
        }
    }

    private loginHandler(): void {
        this.configService
            .get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .pipe(first(v => !!v?.idUser))
            .subscribe((profile) => {
                this.getProfileHandler(profile);
            });
    }

    private getProfileHandler(profile: UserProfile): void {
        const userTheme: TColorTheme = profile.extProfile.colorTheme;
        const currentTheme: TColorTheme = this.appColorTheme$.getValue();

        if (userTheme && userTheme !== currentTheme) {
            this.appColorTheme$.next(userTheme);
        }

        if (!userTheme && currentTheme) {
            this.saveColorThemeToProfile(currentTheme);
        }
    }

    private async saveColorThemeToProfile(theme: TColorTheme): Promise<void> {
        if (!this.userService) {
            this.userService = await this.injectionService.getService<UserService>('user.user-service');
        }

        if (theme === this.userService.userProfile.extProfile.colorTheme) {
            return;
        }

        try {
            await this.userService.updateProfile({
                extProfile: {
                    colorTheme: theme,
                },
            }, {updatePartial: true});
        } catch (error) {
            this.logService.sendLog({code: '1.1.26', data: error, from: {
                service: 'ColorThemeService',
                method: 'saveColorThemeToProfile',
            }});
        }
    }
}
