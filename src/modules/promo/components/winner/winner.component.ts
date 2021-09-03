import {
    trigger,
    transition,
    style,
    animate,
} from '@angular/animations';
import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    HostBinding,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DateTime} from 'luxon';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    InjectionService,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import * as Params from './winner.params';

@Component({
    selector: '[wlc-winner]',
    templateUrl: './winner.component.html',
    styleUrls: ['./styles/winner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('enter', [
            transition(':enter', [
                style({opacity: 0}),
                animate('200ms', style({opacity: 1})),
            ]),
        ]),
    ],
})
export class WinnerComponent extends AbstractComponent implements OnInit {
    @HostBinding('@enter') protected animation = true;
    public $params: Params.IWinnerCParams;

    @Input() protected inlineParams: Params.IWinnerCParams;

    protected gamesCatalogService: GamesCatalogService;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IWinnerCParams,
        protected configService: ConfigService,
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

    public get gameImage(): string {
        return this.$params.winner.game.image;
    }

    public get gameName(): string {
        return this.$params.winner.game.name[this.translate.currentLang] || this.$params.winner.game.name.en;
    }

    public get name(): string {
        return this.$params.winner.name;
    }

    public get amount(): number {
        return this.$params.winner.amount;
    }

    public get currency(): string {
        return this.$params.winner.currency;
    }

    public get countryIso2(): string {
        return this.$params.winner.countryIso2;
    }

    public get countryIso3(): string {
        return this.$params.winner.countryIso3;
    }

    public get countryUrl(): string {
        return `/gstatic/wlc/flags/4x3/${this.$params.winner.countryIso2}.svg`;
    }

    public get date(): DateTime {
        return this.$params.winner.date;
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    /**
     * Start game
     *
     * @param {Event} $event
     * @param {boolean} demo
     * @param {boolean} modal
     */
    public async startGame($event: Event, demo: boolean = false, modal: boolean = false): Promise<void> {
        $event.stopPropagation();

        if (!this.gamesCatalogService) {
            this.gamesCatalogService = await this.injectionService.getService('games.games-catalog-service');
        }

        this.gamesCatalogService.launchGame(this.$params.winner.game, {
            demo,
            modal: {
                show: modal,
            },
        });
    }
}
