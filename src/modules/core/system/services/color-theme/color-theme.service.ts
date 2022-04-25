import {Injectable} from '@angular/core';
import {Meta} from '@angular/platform-browser';
import {first} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';

import {
    UserService,
    UserProfile,
} from 'wlc-engine/modules/user';
import {ColorThemeValues} from 'wlc-engine/modules/core/constants';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {IColorThemeSwitchingConfig} from
    'wlc-engine/modules/core/system/interfaces/base-config/color-theme-switching.config';

import _isUndefined from 'lodash-es/isUndefined';

@Injectable({
    providedIn: 'root',
})
export class ColorThemeService {

    private config: IColorThemeSwitchingConfig;
    private userService: UserService;

    constructor(
        private configService: ConfigService,
        private injectionService: InjectionService,
        private eventService: EventService,
        private logService: LogService,
        private meta: Meta,
    ) {
        this.init();
    }

    private init(): void {
        this.config = {
            altName: ColorThemeValues.altThemeName,
            ...this.configService.get<IColorThemeSwitchingConfig>('$base.colorThemeSwitching'),
        };

        this.initListeners();

        const appStartStatus = this.configService.get<string>({
            name: ColorThemeValues.localStoreName,
            storageType: 'localStorage',
        });

        this.eventService.emit({
            name: ColorThemeValues.changeEvent,
            data: !!appStartStatus,
        });

        if (this.configService.get<boolean>('$user.isAuthenticated')) {
            this.loginHandler();
        }
    }

    private initListeners(): void {
        this.eventService.subscribe<boolean>(
            {name: ColorThemeValues.changeEvent},
            (status) => {
                this.colorThemeChangeHandler(status);
            },
        );

        this.eventService.subscribe({name: 'LOGIN'}, () => {
            this.loginHandler();
        });
    }

    private colorThemeChangeHandler(status: boolean): void {
        const currentTheme = status ? this.config.altName : null;

        this.configService.set({
            name: ColorThemeValues.localStoreName,
            value: currentTheme,
            storageType: 'localStorage',
            storageClear: status ? null : 'localStorage',
        });

        this.configService.set({
            name: ColorThemeValues.configName,
            value: currentTheme,
        });

        if (this.config.metaColorConfig) {
            this.meta.updateTag({
                name: ColorThemeValues.tagName,
                content: status
                    ? this.config.metaColorConfig.alt || ColorThemeValues.defThemeColor
                    : this.config.metaColorConfig.default || ColorThemeValues.defThemeColor,
            });
        }

        if (this.configService.get<boolean>('$user.isAuthenticated')) {
            this.saveColorThemeToProfile(currentTheme);
        }
    }

    private loginHandler(): void {
        this.configService
            .get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .pipe(first(v => !!v && !!v.email))
            .subscribe((profile) => {
                this.getProfileHandler(profile);
            });
    }

    private getProfileHandler(profile: UserProfile): void {
        const userTheme = profile.extProfile.colorTheme;
        const currentTheme = this.configService.get<string>(ColorThemeValues.configName);

        if (!_isUndefined(userTheme) && userTheme !== currentTheme) {
            this.eventService.emit({name: ColorThemeValues.changeEvent, data: !!userTheme});
        } else {
            this.saveColorThemeToProfile(currentTheme);
        }
    }

    private async saveColorThemeToProfile(theme: string): Promise<void> {
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
            }, true);
        } catch (error) {
            this.logService.sendLog({code: '1.1.26', data: error, from: {
                service: 'ColorThemeService',
                method: 'saveColorThemeToProfile',
            }});
        }
    }


}
