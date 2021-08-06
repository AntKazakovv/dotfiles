import {
    Injectable,
    Inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {
    LangChangeEvent,
    TranslateService,
} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import {filter} from 'rxjs/operators';

import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {LivechatAbstract} from 'wlc-engine/modules/livechat/system/classes/livechatAbstract.class';
import {ILivechatConfig} from 'wlc-engine/modules/livechat/system/interfaces/livechat.interface';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';

@Injectable({
    providedIn: 'root',
})
export class VerboxService extends LivechatAbstract {
    public chatId = 'verbox';
    public forceHideStyles = '#supportTrigger {display: none !important;}';
    protected options: ILivechatConfig = this.configService.get<ILivechatConfig>('$base.livechat');

    constructor(
        @Inject(DOCUMENT) protected document: HTMLDocument,
        protected eventService: EventService,
        protected configService: ConfigService,
        protected logService: LogService,
        protected translateService: TranslateService,
    ) {
        super(document, eventService);
    }

    /**
     * Main init verbox chat code method
     */
    public init(): void {
        super.init();

        let current = this.translateService.currentLang;
        this.translateService.onLangChange.subscribe(({lang}: LangChangeEvent) => {
            if (lang !== current) {
                this.reloadChat();
                current = lang;
            }
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
        try {
            window.Verbox('openSupport');
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
        }
    }

    /**
     * Close chat window method
     */
    public hideChat(): void {
        try {
            window.Verbox('closeSupport');
        } catch (error) {
            this.logService.sendLog({code: '14.0.0', data: error});
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
            this.configService
                .get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
                .pipe(filter((v) => !!v))
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
