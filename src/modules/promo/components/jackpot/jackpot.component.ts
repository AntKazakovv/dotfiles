import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ConfigService,
    EventService,
    InjectionService,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';

import * as Params from './jackpot.params';

@Component({
    selector: '[wlc-jackpot]',
    templateUrl: './jackpot.component.html',
    styleUrls: ['./styles/jackpot.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JackpotComponent extends AbstractComponent implements OnInit {
    public override $params: Params.IJackpotCParams;

    @Input() protected inlineParams: Params.IJackpotCParams;

    protected gamesCatalogService: GamesCatalogService;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IJackpotCParams,
        configService: ConfigService,
        protected translate: TranslateService,
        protected injectionService: InjectionService,
        protected modalService: ModalService,
        protected eventService: EventService,
    ) {
        super(
            {injectParams, defaultParams: Params.defaultParams},
            configService,
        );
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.gamesCatalogService = await this.injectionService.getService('games.games-catalog-service');
    }

    public startGame($event: Event): void {
        $event.stopPropagation();

        const {merchantID, launchCode} = this.$params.data;
        const game = this.gamesCatalogService.getGame(merchantID, launchCode);

        this.gamesCatalogService.launchGame(game, {
            modal: {
                show: true,
            },
        });
    }
}
