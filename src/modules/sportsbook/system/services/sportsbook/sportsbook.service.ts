import {
    Injectable,
    Inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {UIRouter} from '@uirouter/core';
import {
    fromEvent,
    Subject,
    Observable,
} from 'rxjs';
import {
    map,
    filter,
} from 'rxjs/operators';
import {
    IIndexing,
    ConfigService,
    Deferred,
} from 'wlc-engine/modules/core';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {
    ISportsbookSettings,
    ISportsbookSettingsFilter,
} from 'wlc-engine/modules/sportsbook';

import _get from 'lodash-es/get';
import _find from 'lodash-es/find';
import _set from 'lodash-es/set';
import _isString from 'lodash-es/isString';
import _isEmpty from 'lodash-es/isEmpty';
import _forEach from 'lodash-es/forEach';

interface IMessage {
    eventType: string;
    eventData?: IIndexing<any>;
}

@Injectable({
    providedIn: 'root',
})
export class SportsbookService {

    public ready: Promise<void>;
    public urlPathParams: string[] = [
        'page',
        'page2',
        'page3',
        'page4',
        'page5',
    ];
    public urlQueryParams: string[] = [
        'action',
    ];

    private $readyStatus = new Deferred<void>();
    private eventSubject: Subject<IMessage> = new Subject<IMessage>();
    private settings: ISportsbookSettings[] = [
        {
            id: 'betradar',
            merchantId: 958,
            launchCode: 'sportsbookNEW',
        },
        {
            id: 'digitain',
            merchantId: 972,
            launchCode: '1',
        },
        {
            id: 'pinnacleSW',
            merchantId: 922,
            launchCode: 'sportbook',
        },
        {
            id: 'bti',
            merchantId: 962,
            launchCode: 'Sportsbook',
        },
        {
            id: 'altenar',
            merchantId: 908,
            launchCode: 'sportbook',
        },
        {
            id: 'tglab',
            merchantId: 903,
            launchCode: 'sports',
        },
    ];

    constructor(
        protected configService: ConfigService,
        protected gamesCatalogService: GamesCatalogService,
        protected router: UIRouter,
        @Inject(DOCUMENT) protected document: HTMLDocument,
    ) {
        this.init();
    }

    /**
     * Get sportsbook settings (by id,merchantId or for first available)
     *
     * @param {ISportsbookSettingsFilter} filter
     * @returns {ISportsbookSettings}
     */
    public getSportsbookSettings(filter?: ISportsbookSettingsFilter): ISportsbookSettings {
        return _find(this.settings, (settings) => {
            if ((filter?.id && settings.id !== filter.id) || (filter?.merchantId && settings.merchantId !== filter.merchantId)) {
                return;
            }
            return !!this.gamesCatalogService.getGame(settings.merchantId, settings.launchCode, true);
        });
    }

    /**
     * On iframe message
     *
     * @param {string} type
     * @returns {Observable<IMessageData>}
     */
    public onIframeMessage(type: string): Observable<IIndexing<any>> {
        return this.eventSubject.pipe(
            filter((message) => message.eventType === type),
            map((message) => message.eventData),
        );
    }

    /**
     * Set iframe message
     *
     * @param {string} type Message type
     * @param {{}} data Message data
     */
    public sendIframeMessage(type: string, data = {}): void {
        const iframe: HTMLIFrameElement = this.iframe();
        if (iframe) {
            iframe.contentWindow.postMessage(JSON.stringify({
                eventType: type,
                eventData: data,
            }), '*');
        }
    }

    /**
     * Go to page by link
     *
     * @param {string} locationPath
     */
    public goToPageByLink(locationPath: string): void {
        const stateParams = this.generateStateParams(locationPath);
        this.router.stateService.go('app.sportsbook', stateParams);
    }

    /**
     * Generate sportsbook state params by location path
     *
     * @param {string} locationPath
     * @returns {{IIndexing<string>}}
     */
    public generateStateParams(locationPath: string): IIndexing<string> {
        const url = new URL(`https:/'${locationPath}`),
            urlPath: string[] = url.pathname.split('/');
        urlPath.shift();

        const params: IIndexing<string> = {};
        let i: number = 1;
        _forEach(urlPath, (pathItem: string) => {
            if (pathItem) {
                const param: string = (_isEmpty(params)) ? 'page' : `page${i}`;
                _set(params, param, pathItem);
                i += 1;
            }
        });
        return params;
    }

    /**
     * Enable message event listener and default subscriptions
     *
     * @param {Subject<void>} cancel
     */
    protected enableMessageEventListener(): void {
        fromEvent(window, 'message').pipe(
            //takeUntil(cancel),
            map((message) => {
                const data = _get(message, 'data');
                if (!_isString(data)) {
                    return false;
                }

                let msg: IMessage;
                try {
                    msg = JSON.parse(data);
                } catch (error) {
                    return false;
                }

                if (!_get(msg, 'eventType')) {
                    return false;
                };
                return msg;
            }),
            filter((message: IMessage | boolean) => {
                return !!message;
            }),
        ).subscribe((message: any) => {
            this.eventSubject.next(message);
        });
    }

    private async init(): Promise<void> {
        this.ready = this.$readyStatus.promise;
        await this.gamesCatalogService.ready;
        this.$readyStatus.resolve();
        this.enableMessageEventListener();
    }

    /**
     * Trying to find an iframe on the page
     */
    private iframe(): HTMLIFrameElement {
        return this.document.querySelector('#egamings_container iframe') as HTMLIFrameElement;
    }
}
