import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    ChangeDetectionStrategy,
    Input,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    InjectionService,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    Game,
    GamesCatalogService,
} from 'wlc-engine/modules/games';
import {LatestBetsService} from 'wlc-engine/modules/promo/system/services/latest-bets/latest-bets.service';

import * as Params from './latest-bets-item.params';

import {
    IPlayGameForRealCParams,
} from 'wlc-engine/modules/games/components/play-game-for-real/play-game-for-real.params';
import {LatestBetsModel} from 'wlc-engine/modules/promo/system/models';

@Component({
    selector: '[wlc-latest-bets-item]',
    templateUrl: './latest-bets-item.component.html',
    styleUrls: ['./styles/latest-bets-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatestBetsItemComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILatestBetsItemCParams;
    @Input() public game: Game;

    public override $params: Params.ILatestBetsItemCParams;
    protected logoImageSource: string = '';
    protected nameGame: string = '';
    protected imageGame: string = '';
    protected gamesCatalogService: GamesCatalogService;
    protected latestBetsService: LatestBetsService;
    private categoryNameIcons: string[] = ['top.svg', 'new.svg', 'jackpot.svg', 'other.svg'];

    constructor(
        @Inject('injectParams') protected params: Params.ILatestBetsItemCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected injectionService: InjectionService,
        protected modalService: ModalService,
    ) {
        super(
            <IMixedParams<Params.ILatestBetsItemCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.logoImageSource = this.gameIcon;
        if (!this.gamesCatalogService) {
            this.gamesCatalogService = await this.injectionService.getService('games.games-catalog-service');
            await this.gamesCatalogService.ready;
        }
        this.game = this.gamesCatalogService.getGameById(+this.gameID);
        this.nameGame = this.gamesCatalogService.getGameById(+this.gameID).name['en'];
        this.imageGame = this.gamesCatalogService.getGameById(+this.gameID).image;
    }

    public showModal(game: Game, betAmount: string, coefficient: string, profitAmount: string, currency: string,
        isWin: boolean): void {
        this.modalService.showModal<IPlayGameForRealCParams>('runGame', {
            common: {
                game: game,
                disableDemo: false,
                latestBetWidget: {
                    isLatestBetsWidget: true,
                    currency: currency,
                    amount: betAmount,
                    coefficient: coefficient,
                    profit: profitAmount === '0' ? betAmount : profitAmount,
                    isWin: isWin,
                },
            },
        });
    }

    public get oneBet(): LatestBetsModel {
        return this.$params.bet;
    }

    public get gameID(): string {
        return this.$params.bet.gameID;
    }

    public get betAmount(): string {
        return this.$params.bet.betAmount.toString();
    }

    public get profitAmount(): string {
        return this.$params.bet.profitAmount.toString();
    }

    public get multiplier(): string {
        return this.$params.bet.multiplier.toFixed(2).toString();
    }

    public get userName(): string {
        return this.$params.bet.userName;
    }

    public get gameIcon(): string {
        return '/wlc/icons/european/v1/' + this.categoryNameIcons[
            (Math.floor(Math.random()*(this.categoryNameIcons.length)))];
    }

    public get currency(): string {
        return this.$params.bet.currency;
    }

    public get type(): string {
        return this.$params.bet.betType;
    }

    public get isWin(): boolean {
        return this.type === 'win';
    }
}
