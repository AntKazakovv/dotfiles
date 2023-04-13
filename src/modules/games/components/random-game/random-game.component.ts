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
    ModalService,
} from 'wlc-engine/modules/core';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {RandomGameAbstract} from 'wlc-engine/modules/games/system/classes/random-game.abstract';

import * as Params from './random-game.params';

@Component({
    selector: '[wlc-random-game]',
    templateUrl: './random-game.component.html',
    styleUrls: ['./styles/random-game.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RandomGameComponent extends RandomGameAbstract<Params.IRandomGameCParams> implements OnInit {
    @Input() protected inlineParams: Params.IRandomGameCParams;

    public imageName: boolean = true;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IRandomGameCParams,
        gamesCatalogService: GamesCatalogService,
        configService: ConfigService,
        modalService: ModalService,
        eventService: EventService,
    ) {
        super(
            {
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
            modalService,
            eventService,
            gamesCatalogService,
        );
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.$params.image =  this.inlineParams?.image || this.injectParams?.image || Params.defaultParams.image;
    }
}
