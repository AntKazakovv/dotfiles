import {Injectable} from '@angular/core';
import {
    BehaviorSubject,
    Subject,
    Subscription,
} from 'rxjs';
import {
    map,
    filter,
    takeUntil,
} from 'rxjs/operators';
import {
    ConfigService,
    EventService,
    Deferred,
    IIndexing,
} from 'wlc-engine/modules/core';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {
    PragmaticLiveData,
    PragmaticLiveModel,
} from 'wlc-engine/modules/games/system/models/pragmatic-live.model';
import {UserProfile} from 'wlc-engine/modules/user';

import _each from 'lodash-es/each';
import _find from 'lodash-es/find';

export interface IPragmaticPlaySettings {
    dgaUrl: string;
    casinoId: string;
}

interface ISubscribedGame {
    game: Game;
    subscribers: number;
    flow: BehaviorSubject<PragmaticLiveModel>;
}

@Injectable({
    providedIn: 'root',
})
export class PragmaticPlayLiveService {

    private connected: boolean = false;
    private connectReady = new Deferred();
    private connectInProgress: boolean = false;
    private websocket: WebSocket = null;
    private subscribed: IIndexing<ISubscribedGame> = {};
    private currency: string = 'EUR';

    private readonly apiUrl: string;
    private readonly casinoId: string;

    constructor(
        private configService: ConfigService,
        private eventService: EventService,
    ) {
        const settings = this.configService.get<IPragmaticPlaySettings>('pragmaticPlaySettings');
        this.apiUrl = settings?.dgaUrl;
        this.casinoId = settings?.casinoId;

        this.configService.ready.then(() => {
            this.currency = this.configService.get<string>('appConfig.user.currency')
                || this.configService.get<string>('$base.defaultCurrency');
        });

        this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$')
            .pipe(
                filter((user: UserProfile): boolean =>
                    !!user && this.configService.get<boolean>('$user.isAuthenticated'),
                ),
                map((user: UserProfile): string =>
                    user.currency || this.configService.get<string>('$base.defaultCurrency')),
                filter((currency: string): boolean => currency !== this.currency),
            )
            .subscribe(async (currency) => {
                this.currency = currency;
                if (this.hasSubscribers()) {
                    this.disconnect();
                }
            });

        this.eventService.subscribe([{name: 'LOGOUT'}],
            () => {
                this.currency = this.configService.get<string>('$base.defaultCurrency');
                if (this.hasSubscribers()) {
                    this.disconnect();
                }
            },
        );
    }

    /**
     * Subscribe game to pragmatic data
     *
     * @param game {Game} game
     * @param until {Subject} take until subject
     * @param observer {function} observer
     * @returns Promise<Subscription>
     */
    public async subscribe(
        game: Game,
        until: Subject<unknown>,
        observer: (pragmaticData: PragmaticLiveModel) => void,
    ): Promise<Subscription> {
        if (game.merchantID !== 913) {
            return;
        }

        if (!this.connected && !this.connectInProgress) {
            this.connect();
        }

        await this.connectReady.promise;

        const tableId = game.launchCode;

        if (!this.subscribed[tableId]) {
            this.subscribed[tableId] = {
                game,
                subscribers: 1,
                flow: new BehaviorSubject<PragmaticLiveModel>(null),
            };
        } else {
            this.subscribed[tableId].subscribers++;
        }

        until.subscribe({
            complete: () => {
                if (this.subscribed[tableId] !== null) {
                    this.subscribed[tableId].subscribers--;
                    if (this.subscribed[tableId].subscribers === 0) {
                        this.makeUnSubscribe();
                    }
                }
            },
        });

        this.makeSubscribe(tableId);

        return this.subscribed[tableId].flow
            .pipe(
                takeUntil(until),
            )
            .subscribe({
                next: (pragmaticData: PragmaticLiveModel) => {
                    observer(pragmaticData);
                },
            });
    }

    private async connect(): Promise<void> {
        if (this.connectInProgress || !this.apiUrl) {
            return;
        }

        this.connectInProgress = true;

        await this.configService.ready;

        if (this.websocket !== null && this.websocket.readyState !== 3) {
            this.websocket.close();
        }
        this.websocket = new WebSocket(this.apiUrl);

        this.websocket.onopen = () => {
            this.onWsOpen();
        };
        this.websocket.onclose = () => {
            this.onWsClose();
        };
        this.websocket.onmessage = (event: MessageEvent) => {
            this.onWsMessage(event);
        };
        this.websocket.onerror = () => {
            this.onWsError();
        };
    }

    private async disconnect(): Promise<void> {
        await this.connectReady.promise;
        this.websocket?.close();
    }

    private send(message: string): void {
        this.websocket.send(message);
    }

    private async makeSubscribe(tableId: string): Promise<void> {
        const subscribeMessage = {
            type: 'subscribe',
            key: tableId,
            casinoId: this.casinoId,
            currency: this.currency,
        };

        this.send(JSON.stringify(subscribeMessage));
    }

    private makeUnSubscribe(): void {
        if (!this.hasSubscribers()) {
            this.disconnect();
        }
    }

    private onMessage(data: PragmaticLiveData): void {

        if (data.tableId && this.subscribed[data.tableId].subscribers) {
            const pragmaticData = new PragmaticLiveModel(
                {
                    service: 'PragmaticPlayLiveService',
                    method: 'onMessage',
                },
                data,
            );
            this.subscribed[data.tableId].flow.next(pragmaticData);
            return;
        }

        if (data.error?.includes('Table not found')) {
            const tableId = data.error.replace('Table not found: ', '');
            this.subscribed[tableId].flow.complete();
            this.subscribed[tableId] = null;
        }
    }

    private onWsOpen(): void {
        this.connected = true;
        this.connectInProgress = false;
        this.connectReady.resolve();

        _each(this.subscribed, (item, tableId) => {
            if (item?.subscribers) {
                this.makeSubscribe(tableId);
            }
        });
    }

    private onWsClose(): void {
        this.connected = false;
        this.connectInProgress = false;
        this.connectReady = new Deferred();
        this.websocket = null;
        if (this.hasSubscribers()) {
            this.connect();
        }
    }

    private onWsMessage(event: MessageEvent): void {
        try {
            const data = JSON.parse(event.data);
            this.onMessage(data);
        } catch (error) {
            //
        }

    }

    private hasSubscribers(): boolean {
        return !!_find(this.subscribed, (item) => !!item?.subscribers);
    }

    private onWsError(): void {
        // TODO: maybe need some errors process, but i don't know which
    }
}
