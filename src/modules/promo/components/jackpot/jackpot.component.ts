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
    IPushMessageParams,
    ModalService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {GamesCatalogService, IPlayGameForRealCParams} from 'wlc-engine/modules/games';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import * as Params from './jackpot.params';

@Component({
    selector: '[wlc-jackpot]',
    templateUrl: './jackpot.component.html',
    styleUrls: ['./styles/jackpot.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JackpotComponent extends AbstractComponent implements OnInit {
    public $params: Params.IJackpotCParams;

    @Input() protected inlineParams: Params.IJackpotCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IJackpotCParams,
        protected configService: ConfigService,
        protected translate: TranslateService,
        protected gamesCatalogService: GamesCatalogService,
        protected modalService: ModalService,
        protected eventService: EventService,
    ) {
        super(
            {injectParams, defaultParams: Params.defaultParams},
            configService,
        );
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
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
