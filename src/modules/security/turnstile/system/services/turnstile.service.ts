import {
    Inject,
    Injectable,
    NgZone,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {
    BehaviorSubject,
    Observable,
    filter,
} from 'rxjs';

import {
    ConfigService,
    DataService,
    EventService,
    IData,
} from 'wlc-engine/modules/core';
import {WINDOW} from 'wlc-engine/modules/app/system';

export type TurnstileAction = 'signup' | 'login' | 'deposit' | unknown;
type TurnstileWlcConfig = {
    isEnabled: boolean,
    actions: TurnstileAction[],
}

@Injectable({
    providedIn: 'root',
})
export class TurnstileService {
    private _turnstileToken$: BehaviorSubject<string> = new BehaviorSubject(null);
    private _turnstileWlcConfig: TurnstileWlcConfig;
    private turnstileAppConfig: Record<string, string>;
    private turnstileSiteKey: string;
    private parsedAction: string;

    public get turnstileToken$(): BehaviorSubject<string> {
        return this._turnstileToken$;
    }

    public get turnstileWlcConfig(): TurnstileWlcConfig {
        return this._turnstileWlcConfig;
    }

    public get tokenReceived(): Observable<string> {
        return this._turnstileToken$.asObservable().pipe(filter((v) => !!v));
    }

    constructor(
        @Inject(DOCUMENT) private document: Document,
        @Inject(WINDOW) private window: Window,
        protected ngZone: NgZone,
        protected eventService: EventService,
        protected configService: ConfigService,
        protected dataService: DataService,
    ) {
        this.init();
    }

    public async init(): Promise<void> {
        await this.configService.ready;
        this._turnstileWlcConfig = this.configService.get('appConfig.objectData.turnstile');
        this.turnstileAppConfig = this.configService.get<Record<string, string>>('$base.site.turnstileConfig');
        if (!this.turnstileWlcConfig.isEnabled) return;

        await this.getSiteKey();
        await this.loadTurnstileScript();
        this.eventService.filter([{name: 'turnstile.launch'}])
            .subscribe(event => {
                if (this.turnstileWlcConfig.actions.includes(event?.data)){
                    this.parseAction(`-${event?.data}`);
                    this.launchCheck();
                }
            });
        this.initLogoutSubscription();
    }

    public launch(action: TurnstileAction): void {
        this.parseAction(`-${action}`);
        this.launchCheck();
    }

    public async loadTurnstileScript(): Promise<void> {
        const script: HTMLScriptElement = this.document.createElement('script');
        script.setAttribute('id', 'turnstile-script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    }

    protected async getSiteKey(): Promise<void> {
        const result: IData<string> = await this.dataService.request({
            name: 'turnstile',
            system: 'security',
            url: '/turnstile',
            type: 'GET',
        });
        if (result.data && result.code === 200) {
            this.turnstileSiteKey = result.data;
        } else {
            console.error('Cant get turnstile siteKey');
            this.turnstileSiteKey = 'wrong key';
        }
    }

    protected setToken(token: string): void{
        if (!token) return;
        this._turnstileToken$.next(token);
    }

    protected mergeParams(): Record<string, string> {
        const defaultParams: Record<string, string> = {
            appearance: 'interaction-only',
            sitekey: this.turnstileSiteKey,
            action: this.parsedAction,
        };

        return {...defaultParams, ...this.turnstileAppConfig};
    }

    protected pushEventToDataLayer(event: {}): void {
        if (!this.window['dataLayer']) return;
        this.window['dataLayer'].push(event);
    }

    protected launchCheck(): void {
        const tsBlock: HTMLDivElement = document.createElement('div');
        const modal: HTMLDivElement = document.createElement('div');
        const params: Record<string, string> = this.mergeParams();
        tsBlock.id = 'ts';
        modal.style.display = 'none';
        modal.appendChild(tsBlock);
        document.body.appendChild(modal);

        const turnstileCallback = (): void => {
            const turnstileId = this.window.turnstile.render(tsBlock, {
                ...params,
                callback: (token) => {
                    modal.style.display = 'none';
                    this.setToken(token);
                    this.window.turnstile.remove(turnstileId);
                    sessionStorage.setItem('ts', 'true');
                },

                'before-interactive-callback': () => {
                    const modalStyles: string = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        z-index: 9999;

                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100vw;
                        height: 100vh;

                        background-color: #00000076;
                        backdrop-filter: blur(6px);
                    `;
                    modal.setAttribute('style', modalStyles);
                    this.pushEventToDataLayer({event: 'turnStyleLaunched'});
                },

                'error-callback': (err) => {
                    this.pushEventToDataLayer({event: 'turnStyleError', turnStyleError: err});
                    console.error('Cloudflare turnstile error:', err);
                },
            });
        };

        if (typeof this.window.turnstile !== 'undefined') {
            turnstileCallback();
        } else {
            this.ngZone.runOutsideAngular(() => {
                this.document.getElementById('turnstile-script')!.addEventListener('load', turnstileCallback);
            });
        }
    }

    protected parseAction(action: string): void {
        if (!action) return;

        const maxActionLength: number = 32;
        const hostName: string = this.window.location.host.replace(/[^\w-]/g, '_');
        const hostNameMaxLength: number = maxActionLength - action.length;

        this.parsedAction = hostName.slice(0, hostNameMaxLength) + action;
    }

    private initLogoutSubscription(): void {
        this.eventService.subscribe({
            name: 'LOGOUT',
        }, () => {
            this._turnstileToken$.next(null);
        });
    }
}
