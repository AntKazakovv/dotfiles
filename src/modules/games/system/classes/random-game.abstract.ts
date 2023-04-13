import {Directive} from '@angular/core';
import _filter from 'lodash-es/filter';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    GlobalHelper,
    IComponentParams,
    IMixedParams,
    IPushMessageParams,
    ModalService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {Game} from 'wlc-engine/modules/games/system/models';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services';

@Directive()
export abstract class RandomGameAbstract<T extends IComponentParams<unknown, unknown, unknown>>
    extends AbstractComponent {

    public override $params: T;

    protected games: Game[];
    protected gamesForAuthorized: boolean = false;

    constructor(
        mixedParams: IMixedParams<T>,
        configService: ConfigService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected gamesCatalogService: GamesCatalogService,
    ) {
        super(
            mixedParams,
            configService,
        );
    }

    public toRandomGame(): void {
        const auth = this.configService.get<boolean>('$user.isAuthenticated');

        if (!this.games || this.gamesForAuthorized !== auth) {
            this.getGames(auth);
        }

        if (this.games.length) {
            const gameNumber: number = GlobalHelper.randomNumber(0, this.games.length - 1);
            this.games[gameNumber].launch({
                demo: !auth,
            });
        } else if (!auth) {
            this.modalService.showModal('login');
        } else {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams> {
                    type: 'error',
                    title: gettext('Failed to open game'),
                    message: gettext('Sorry, something went wrong!'),
                },
            });
        }
    }

    protected getGames(auth: boolean): void {
        const games = this.gamesCatalogService.getGameList();
        this.games = auth ? games : _filter(games, {hasDemo: true});
        this.gamesForAuthorized = auth;
    }
}
