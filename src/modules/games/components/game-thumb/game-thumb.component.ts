import {Component, Inject, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {ConfigService} from 'wlc-engine/modules/core';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import * as Params from './game-thumb.params';

import {
    assign as _assign,
} from 'lodash';

@Component({
    selector: '[wlc-game-thumb]',
    templateUrl: './game-thumb.component.html',
    styleUrls: ['./styles/game-thumb.component.scss'],
})
export class GameThumbComponent extends AbstractComponent implements OnInit {

    @Input() public game: Game;
    @Input() protected inlineParams: Params.IGameThumbCParams;
    public gameThumbSettings: IIndexing<IIndexing<string> | string> = {
        buttons: {},
    };
    public isAuth: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IGameThumbCParams,
        protected gamesCatalogService: GamesCatalogService,
        private ref: ChangeDetectorRef,
        private configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        const buttonParams = this.configService
            .get<string>('$modules.games.components.wlc-game-thumb.buttons');
        if (buttonParams) {
            _assign(this.gameThumbSettings.buttons, buttonParams);
        }

        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
    }

    public startGame(game: Game, demo: boolean, $event: Event): void {
        game.launch({
            demo: demo,
        });
        $event.stopPropagation();
    }

    public async toggleFavourites(game: Game): Promise<void> {
        try {
            game.isFavourite = await this.gamesCatalogService.toggleFavourites(game.ID);
            this.ref.detectChanges();
        } catch (error) {
            // TODO обработка ошибок
        }
    }
}
