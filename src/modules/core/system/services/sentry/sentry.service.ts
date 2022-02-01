'use strict';

import * as Sentry from '@sentry/angular';
import {Event, Severity, Scope} from '@sentry/angular';
import {Cookie} from 'ng2-cookies';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {
    Inject,
    Injectable,
} from '@angular/core';
import {
    ConfigService,
    LogService,
} from 'wlc-engine/modules/core';
import {WINDOW} from 'wlc-engine/modules/app/system';

interface ISentryMessage {
    message: string;
    tags?: IIndexing<string>;
    level?: string;
    data?: IIndexing<any>;
    userInfo?: Sentry.User;
}

@Injectable()
export class SentryService {
    public isInstall: boolean = false;

    private sessionKey: string = 'wlc-session-hash';
    private prod: boolean = !this.window.WLC_ENV;
    private dsn: IIndexing<string> = {
        prod: 'https://4005578ccdcd422580f551621158d92d@sentry.egamings.com/68',
        dev: 'https://850fc7b0547d49db8d67c363bfdd844a@sentry.egamings.com/67',
        autotest: 'https://537009cd82f64045828047b669fb8929@sentry.egamings.com/70',
    };
    private readonly autotest: boolean;
    private readonly sessionHash: string;

    constructor(
        private configService: ConfigService,
        private logService: LogService,
        @Inject(WINDOW) private window: Window,
    ) {
        this.autotest = Cookie
            .get('runautotest') === '7698155c459ee95063a26a7121b2b7916fa36004cbcfe787043d27692b249971';
        if (this.autotest) {
            this.window.testSessionHash = this.sessionHash = this.generateHash();
        } else {
            const hashFromStorage: string = this.configService.get<string>({
                name: this.sessionKey,
                storageType: 'sessionStorage',
            });
            this.sessionHash = hashFromStorage || this.generateHash(true);
        }
        this.initSentry();
    }

    /**
     * Send sentry message
     *
     * @param {ISentryMessage} msg Message info
     */
    public sendMessage(msg: ISentryMessage): void {
        Sentry.withScope((scope: Scope): void => {
            if (msg.tags) {
                scope.setTags(msg.tags);
            }
            if (msg.data) {
                scope.setExtras(msg.data);
            }
            if (msg.userInfo) {
                scope.setUser(msg.userInfo);
            }
            Sentry.captureMessage(
                msg.message, Severity.fromString(msg.level || 'info'),
            );
        });
    }

    /**
     * Generate hash
     *
     * @param {boolean} save Save to session storage
     * @returns {string} Hash string
     */
    private generateHash(save?: boolean): string {
        const hash = this.window.crypto.getRandomValues(new Uint32Array(2))
            .reduce((res, item) => res + item.toString(16), '');
        if (save) {
            this.configService.set({
                name: this.sessionKey,
                value: hash,
                storageType: 'sessionStorage',
            });
        }
        return hash;
    }

    /**
     * Init sentry
     *
     * @returns {boolean} Was inited or not
     */
    private initSentry(): boolean {
        if ((this.window.WLC_ENV !== 'dev' || Cookie.get('allowSentry')) || this.autotest) {
            Sentry.init({
                dsn: this.autotest ? this.dsn.autotest : this.prod ? this.dsn.prod : this.dsn.dev,
                release: '' + this.window.WLC_VERSION,
                environment: this.window.WLC_ENV || 'prod',
                blacklistUrls: [
                    /https?:\/\/((www)\.)?1x2nwh\.com/,
                ],
                beforeSend: (event: Event): Event => {
                    const project = this.window.wlcSentryConfig?.project || 'unknown';
                    event.tags = event.tags || {};
                    event.tags.project = project;
                    event.tags.sessionHash = this.sessionHash;
                    event.message = `[${project}] ${event.message}`;
                    return event;
                },
            });

            if (this.autotest) {
                Sentry.withScope((scope: Scope): void => {
                    scope.setTags({
                        code: '0.0.2',
                        group: 'Common',
                    });
                    Sentry.captureMessage('Autotest Start', Severity.fromString('info'));
                    this.logService.sendLog({code: '0.0.2'});
                });
            }
            this.isInstall = true;
            return true;
        }
        return false;
    }
}
