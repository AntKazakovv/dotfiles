import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {ConfigService, GlobalHelper} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import * as Params from './random-game.params';

@Component({
    selector: '[wlc-random-game]',
    templateUrl: './random-game.component.html',
    styleUrls: ['./styles/random-game.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RandomGameComponent extends AbstractComponent implements OnInit {

    public $params: Params.IRandomGameCParams;
    protected games: Game[];

    @Input() protected inlineParams: Params.IRandomGameCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IRandomGameCParams,
        protected gamesCatalogService: GamesCatalogService,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
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

        if (!this.games) {
            this.games = this.gamesCatalogService.getGameList();
        }

        const gameNumber: number = GlobalHelper.randomNumber(0, this.games.length);
        this.games[gameNumber].launch({
            demo: !this.configService.get<boolean>('$user.isAuthenticated'),
        });
    }
}
