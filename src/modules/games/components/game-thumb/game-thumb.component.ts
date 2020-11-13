import {Component, Inject, Input, OnInit} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {Game} from 'wlc-engine/modules/games/models/game.model';
import {GamesCatalogService} from 'wlc-engine/modules/games';
// import {IGTParams} from 'wlc-engine/modules/games/components/game-thumb/game-thumb.params';

@Component({
    selector: '[wlc-game-thumb]',
    templateUrl: './game-thumb.component.html',
    styleUrls: ['./styles/game-thumb.component.scss'],
})
export class GameThumbComponent extends AbstractComponent implements OnInit {
    @Input() game: any;
    @Input() protected inlineParams: any;

    constructor(
        @Inject('injectParams') protected injectParams: any,
        protected gamesCatalogService: GamesCatalogService,
    ) {
        super({injectParams, defaultParams: {}});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public startGame(game: Game, demo: boolean, $event: Event): void {
        this.gamesCatalogService.startGame(game, {
            demo: demo,
        });
        $event.stopPropagation();
    }
}
