
import {IIndexingString} from 'src/interfaces/global.interface';
import * as Sentry from "@sentry/angular";
import {Event, Severity, Scope} from "@sentry/angular"

// interface IIndexingString {
//     [key: string]: string;
// }

interface IWindow extends Window {
    WLC_ENV?: string;
    WLC_VERSION?: string;
    wlcSentryConfig?: any;
    Sentry?: any;
    testSessionHash?: string;
    sendSentryError?: (code?: string, group?: string, message?: string, level?: string, data?: any) => void;
}

class SentryStart {
    private window: IWindow = window;

    private sessionKey: string = 'wlc-session-hash';
    private prod: boolean = !this.window.WLC_ENV;
    private dsn: IIndexingString = {
        prod: 'https://4005578ccdcd422580f551621158d92d@sentry.egamings.com/68',
        dev: 'https://850fc7b0547d49db8d67c363bfdd844a@sentry.egamings.com/67',
        autotest: 'https://537009cd82f64045828047b669fb8929@sentry.egamings.com/70'
    };
    private autotest: boolean = this.getCookie('runautotest') === '7698155c459ee95063a26a7121b2b7916fa36004cbcfe787043d27692b249971';
    private readonly sessionHash: string;

    constructor() {
        console.log('try start sentry 2', Sentry);

        if (this.autotest) {
            this.window.testSessionHash = this.sessionHash = this.generateHash();
        } else {
            this.sessionHash = sessionStorage.getItem(this.sessionKey) || this.generateHash(true);
        }

        if (this.initSentry()) {
            this.setConfig();
            this.window.sendSentryError = this.sendSentryError;
        }
    }

    public generateHash(save?: boolean): string {
        const hash = window.crypto.getRandomValues(
            new Uint32Array(2)).reduce((res, item) => res + item.toString(16),
            ''
        );
        if (save) {
            sessionStorage.setItem(this.sessionKey, hash);
        }
        return hash;
    }

    public getCookie(name: string): any {
        const matches = document.cookie.match(new RegExp(
            '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    public sendSentryError(code: string, group: string, message: string, level: string, data: any): void {
        if (this.window?.Sentry) {
            Sentry.withScope((scope: Scope): void => {
                scope.setTags({
                    code: code,
                    group: group || 'Common',
                });
                if (data) {
                    scope.setExtras(data);
                }
                Sentry.captureMessage(
                    message, Severity.fromString(level || 'warning')
                );
            });
        }
    }

    public initSentry(): boolean {
        //window['TESTS'] = Sentry.init;

        if (this.window.Sentry && (this.window.WLC_ENV !== 'dev' || this.getCookie('allowSentry')) || this.autotest) {
            console.log(Sentry);
            Sentry.init({
                dsn: this.autotest ? this.dsn.autotest : this.prod ? this.dsn.prod : this.dsn.dev,
                release: '' + this.window.WLC_VERSION,
                environment: this.window.WLC_ENV || 'prod',
                blacklistUrls: [
                    /https?:\/\/((www)\.)?1x2nwh\.com/
                ],
                beforeSend: (event: Event): Event => {
                    const project = this.window.wlcSentryConfig.project || 'unknown';
                    event.tags = event.tags || {};
                    event.tags.project = project;
                    event.tags.sessionHash = this.sessionHash;
                    event.message = `[${project}] ${event.message}`;
                    return event;
                }
            });

            if (this.autotest) {
                Sentry.withScope((scope: Scope): void => {
                    scope.setTags({
                        code: '0.0.2',
                        group: 'Common',
                    });
                    Sentry.captureMessage('Autotest Start', Severity.fromString('info'));
                });
            }
            return true;
        }
        return false;
    }

    public setConfig(): void {
        this.window.wlcSentryConfig = this.window.wlcSentryConfig || {};
        this.window.wlcSentryConfig.isInstall = true;
    }
}

new SentryStart();
