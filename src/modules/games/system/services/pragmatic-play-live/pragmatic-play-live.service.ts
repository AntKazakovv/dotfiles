import {
    inject,
    Injectable,
} from '@angular/core';

import {
    BehaviorSubject, Subject,
    Subscription,
} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import _each from 'lodash-es/each';
import _find from 'lodash-es/find';

import {
    ConfigService,
    EventService,
    IIndexing,
    WebsocketService,
} from 'wlc-engine/modules/core';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {
    PragmaticLiveData,
    PragmaticLiveModel,
} from 'wlc-engine/modules/games/system/models/pragmatic-live.model';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {UserProfile} from 'wlc-engine/modules/user';

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

    private subscribed: IIndexing<ISubscribedGame> = {};
    private currency: string = 'EUR';
    private wsPragmaticSub: Subscription;

    private readonly userService: UserService = inject(UserService);
    private readonly websocketService: WebsocketService = inject(WebsocketService);
    private readonly eventService: EventService = inject(EventService);
    private readonly configService: ConfigService = inject(ConfigService);

    private readonly apiUrl: string;
    private readonly casinoId: string;

    constructor() {
        const settings = this.configService.get<IPragmaticPlaySettings>('pragmaticPlaySettings');
        this.apiUrl = settings?.dgaUrl;
        this.casinoId = settings?.casinoId;
        this.init();
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
        this.connect();
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

    private async init(): Promise<void> {
        this.currency = this.configService.get<string>('appConfig.user.currency')
            || this.configService.get<string>('$base.defaultCurrency');
        this.userService.userProfile$
            .pipe(filter(p => !!p && this.configService.get<boolean>('$user.isAuthenticated')))
            .subscribe((profile: UserProfile) => {
                if (this.currency !== profile.selectedCurrency) {
                    this.currency = profile.selectedCurrency;
                    this.unsubscribe();
                    this.websocketService.closeSocket('pragmatic');
                    this.connect();
                }
            });
        this.eventService.subscribe([{name: 'LOGOUT'}],
            () => {
                this.currency = this.configService.get<string>('$base.defaultCurrency');
                this.unsubscribe();
            },
        );
    }

    private async connect(): Promise<void> {
        if (!this.apiUrl) {
            return;
        }
        await this.configService.ready;

        this.websocketService.addWsEndPointConfig('pragmatic', {server2: this.apiUrl});

        if (this.configService.get('$user.isAuthenticated')) {
            await this.userService.profileReady;
        }

        this.wsPragmaticSub = this.websocketService.getMessages(
            {
                endPoint: 'pragmatic',
            })
            .subscribe((data: PragmaticLiveData) => {
                this.onMessage(data);
            });
        this.onWsOpen();
    }

    private makeSubscribe(tableId: string): void {
        const subscribeMessage = {
            type: 'subscribe',
            key: tableId,
            casinoId: this.casinoId,
            currency: this.currency,
        };

        this.websocketService.sendToWebsocket('pragmatic', null, subscribeMessage);
    }

    private makeUnSubscribe(): void {
        if (!this.hasSubscribers()) {
            this.wsPragmaticSub.unsubscribe();
        }
    }

    private unsubscribe(): void {
        if (this.wsPragmaticSub) {
            this.wsPragmaticSub.unsubscribe();
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
            this.subscribed[tableId]?.flow.complete();
            this.subscribed[tableId] = null;
        }
    }

    private onWsOpen(): void {
        _each(this.subscribed, (item, tableId) => {
            if (item?.subscribers) {
                this.makeSubscribe(tableId);
            }
        });
    }

    private hasSubscribers(): boolean {
        return !!_find(this.subscribed, (item) => !!item?.subscribers);
    }
}
