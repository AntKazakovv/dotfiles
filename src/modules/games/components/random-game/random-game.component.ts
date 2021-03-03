import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {
    ConfigService,
    EventService,
    GlobalHelper,
    ModalService,
} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {IPushMessageParams, NotificationEvents} from 'wlc-engine/modules/core/system/services/notification';
import * as Params from './random-game.params';

import {
    filter as _filter,
} from 'lodash-es';

@Component({
    selector: '[wlc-random-game]',
    templateUrl: './random-game.component.html',
    styleUrls: ['./styles/random-game.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RandomGameComponent extends AbstractComponent implements OnInit {

    public $params: Params.IRandomGameCParams;
    protected games: Game[];
    protected gamesForAuthorized: boolean = false;

    @Input() protected inlineParams: Params.IRandomGameCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IRandomGameCParams,
        protected gamesCatalogService: GamesCatalogService,
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected eventService: EventService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
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
