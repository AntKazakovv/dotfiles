import {
    Injectable,
    Inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {filter} from 'rxjs/operators';

import {
    ConfigService,
    EventService,
    LogService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';
import {LivechatAbstract, ILivechatConfig} from 'wlc-engine/modules/livechat';

@Injectable({
    providedIn: 'root',
})
export class VerboxService extends LivechatAbstract {
    public chatId = 'verbox';
    protected options: ILivechatConfig = this.configService.get<ILivechatConfig>('$base.livechat');

    constructor(
        @Inject(DOCUMENT) protected document: HTMLDocument,
        protected eventService: EventService,
        protected configService: ConfigService,
        protected logService: LogService,
        protected translateService: TranslateService,
        protected userService: UserService,
    ) {
        super(document, eventService);
    }

    /**
     * Main init verbox chat code method
     */
    public init(): void {
        this.initChat();

        this.translateService.onLangChange.subscribe(() => {
            this.reloadChat();
        });

        if (this.options.autocomplete) {
            this.setUserSettings();
        }
    }

    /**
     * Reload chat (re-init)
     */
    public reloadChat(): void {
        window.Verbox('destroy');
        this.initChat();
    }

    /**
       * Open chat window method
       */
    public openChat(): void {
        if (this.chatIsLoaded()) {
            window.Verbox('openSupport');
        } else {
            this.logService.sendLog({code: '14.0.0'});
        }
    }

    /**
     * Close chat window method
     */
    public hideChat(): void {
        if (this.chatIsLoaded()) {
            window.Verbox('closeSupport');
        } else {
            this.logService.sendLog({code: '14.0.0'});
        }
    }

    /**
     * Check chat is loaded
     *
     * @returns {boolean} true or false
     */
    public chatIsLoaded(): boolean {
        return !!window.Verbox;
    }

    protected initChat(): void {
        if (this.options.type !== 'verbox' || !this.options.code) {
            this.logService.sendLog({code: '14.0.1'});
            return;
        }

        if (this.options.onlyProd && window.WLC_ENV) {
            return;
        }

        const script = this.document.createElement('script');
        script.async = true;
        script.src = 'https://admin.verbox.ru/support/support.js?h=' + this.options.code;

        window.VerboxSetup = this.options?.verboxSetup || {};
        window.VerboxSetup.language  = this.translateService.currentLang || 'en';
        window.supportAPIMethod = 'Verbox';

        if (!this.chatIsLoaded()) {
            window['Verbox'] = function () {
                (window['Verbox'].q = window['Verbox'].q || []).push(arguments);
            };
        }

        this.document.head.appendChild(script);
    }

    protected setUserSettings(): void {
        if(!this.chatIsLoaded()) {
            return;
        }

        this.eventService.subscribe({name: 'LOGIN'}, () => {
            this.userService.userProfile$.pipe(filter((v) => !!v))
                .subscribe((userProfile) => {
                    window.Verbox('setClientInfo', {
                        email: userProfile.email,
                    });
                    this.reloadChat();
                });
        });

        this.eventService.subscribe({name: 'LOGOUT'}, () => {
            for (const key in localStorage) {
                if (key.indexOf('/Client/email')) {
                    localStorage.removeItem(key);
                }
            }
            this.reloadChat();
        });
    }
}

