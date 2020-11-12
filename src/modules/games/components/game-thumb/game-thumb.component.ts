import {Component, Inject, Input, OnInit} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
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
    ) {
        super({injectParams, defaultParams: {}});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
