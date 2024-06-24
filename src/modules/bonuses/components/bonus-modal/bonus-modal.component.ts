import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {Subject} from 'rxjs';
import _set from 'lodash-es/set';
import _map from 'lodash-es/map';
import _merge from 'lodash-es/merge';

import {
    Game,
    GamesCatalogService,
} from 'wlc-engine/modules/games';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    InjectionService,
    IAccordionData,
    IAccordionCParams,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {LootboxPrizeModel} from 'wlc-engine/modules/bonuses/system/models';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services/bonuses/bonuses.service';

import * as Params from './bonus-modal.params';

@Component({
    selector: '[wlc-bonus-modal]',
    templateUrl: './bonus-modal.component.html',
    styleUrls: ['./styles/bonus-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonusModalComponent extends AbstractComponent implements OnInit {
    public bonus: Bonus;
    public override $params: Params.IBonusModalCParams;
    public bonusBgUrl: string;
    public gamesAccordion: IAccordionCParams;
    public isLoadingGames: boolean = false;
    public expandGames$: Subject<void> = new Subject();
    public isRewardsLoading: boolean = false;
    public bonusRewards: IAccordionCParams;

    protected gamesCatalogService: GamesCatalogService;
    protected bonusGamesAccordion: IAccordionData;
    protected freeroundGamesAccordion: IAccordionData;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBonusModalCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected injectionService: InjectionService,
        protected bonusesService: BonusesService,
    ) {
        super(
            <IMixedParams<Params.IBonusModalCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.bonus = this.$params.bonus;

        if (this.showGames) {
            this.prepareGames();
        }

        if (this.configService.get<boolean>('$bonuses.useNewImageSources')) {
            this.bonusBgUrl = this.bonus.imageDescription ? `url(${this.bonus.imageDescription})`: '';
        } else {
            this.bonusBgUrl = this.bonus.imageOther ? `url(${this.bonus.imageOther})` : '';
        }

        if (this.bonus.showOnly) {
            this.addModifiers('show-only');
        }

        if (this.bonus.isLootbox) {
            this.prepareRewards();
        }

        if (this.bonus.isUnavailableForActivation) {
            this.addModifiers('is-unavailable');
        }
    }

    /** Active block is showing only for actual active and lootbox bonuses */
    public get showActiveBlock(): boolean {
        return (this.bonus.isActive || this.bonus.isLootbox) && !this.bonus.isExpired;
    }

    protected async prepareRewards(): Promise<void> {
        this.isRewardsLoading = true;
        this.bonus.lootBoxRewards ??= await this.bonusesService.getLootboxPrizes(this.bonus);

        const rewardsItems: IAccordionData[] = _map(this.bonus.lootBoxRewards,
            ((bonus: LootboxPrizeModel): IAccordionData => {
                return {
                    title: bonus.name,
                    content: [bonus.descriptionClean, bonus.termsClean],
                };
            }));

        this.bonusRewards = _merge(this.$params.rewardsParams, {
            theme: this.$params.theme,
            items: rewardsItems,
        });

        this.isRewardsLoading = false;
        this.cdr.markForCheck();
    }

    public get showAlerts(): boolean {
        return !!(this.$params.alerts && this.$params.alerts.length);
    }

    public get isLootbox(): boolean {
        return this.bonus.target === 'lootbox';
    }

    public get showGames(): boolean {
        return !this.isLootbox || (this.isLootbox && this.bonus.event === 'bet' && !this.bonus.inventoried);
    }

    public expandGames(): void {
        this.expandGames$.next();
    }

    protected async prepareGames(): Promise<void> {
        this.gamesAccordion = _merge(this.$params.gamesAccordionParams, {
            theme: this.$params.theme,
            items: [],
        });

        this.isLoadingGames = true;
        this.bonusGamesAccordion = this.prepareGamesAccordionItem(this.$params.gamesCommon);
        this.gamesCatalogService = await this.injectionService.getService('games.games-catalog-service');

        await this.gamesCatalogService.ready;

        const bonusGames: Game[] = this.gamesCatalogService.getBonusGames(this.bonus.getGamesFilter());

        this.setGames(this.bonusGamesAccordion, bonusGames);
        this.gamesAccordion.items.push(this.bonusGamesAccordion);

        if (this.bonus.target === 'freerounds') {
            this.prepareFreeroundGames();
        }

        this.isLoadingGames = false;
        this.cdr.markForCheck();
    }

    protected prepareGamesAccordionItem(common: IAccordionData): IAccordionData {
        return _merge(common, {wrapper: this.$params.gamesGridWrapperParams});
    }

    protected prepareFreeroundGames(): void {
        if (this.bonus.wageringTotal) {
            return;
        }

        const freeroundGames: Game[] = this.gamesCatalogService.getBonusFreeRoundGames(this.bonus.freeroundGameIds);

        this.freeroundGamesAccordion = this.prepareGamesAccordionItem(this.$params.freeroundGamesCommon);
        this.setGames(this.freeroundGamesAccordion, freeroundGames);
        this.gamesAccordion.items.unshift(this.freeroundGamesAccordion);
    }

    protected setGames(target: IAccordionData, games: Game[]): void {
        _set(target,
            'wrapper.components[0].params.gamesList',
            games,
        );
    }
}
