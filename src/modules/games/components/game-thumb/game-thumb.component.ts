import {Component, Inject, Input, OnInit} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {Game} from 'wlc-engine/modules/games/models/game.model';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {ConfigService} from 'wlc-engine/modules/core';
import {IIndexing} from 'wlc-engine/interfaces/global.interface';
import * as Params from './game-thumb.params';

import {
    merge as _merge,
    assign as _assign,
} from 'lodash';

@Component({
    selector: '[wlc-game-thumb]',
    templateUrl: './game-thumb.component.html',
    styleUrls: ['./styles/game-thumb.component.scss'],
})
export class GameThumbComponent extends AbstractComponent implements OnInit {
    public gameThumbSettings: IIndexing<IIndexing<string> | string> = {
        buttons: {},
    };
    @Input() public game: Game;
    @Input() protected inlineParams: any;

    constructor(
        @Inject('injectParams') protected injectParams: any,
        protected gamesCatalogService: GamesCatalogService,
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
    }

    public startGame(game: Game, demo: boolean, $event: Event): void {
        game.launch({
            demo: demo,
        });
        $event.stopPropagation();
    }
}
