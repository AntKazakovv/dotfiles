import {
    ChangeDetectionStrategy,
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
    InjectionService,
    IAccordionData,
    IAccordionCParams,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {LootboxPrizeModel} from 'wlc-engine/modules/bonuses/system/models';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services/bonuses/bonuses.service';
import {IAlertCParams} from 'wlc-engine/modules/core/components/alert/alert.params';
import {TBonusAlertsGlobal} from 'wlc-engine/modules/bonuses/system/interfaces';

import * as Params from './bonus-modal.params';
import {IBonusWagerCParams} from 'wlc-engine/modules/bonuses/components/bonus-wager/bonus-wager.params';

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
    protected _alerts: IAlertCParams[] = [];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBonusModalCParams,
        protected injectionService: InjectionService,
        protected bonusesService: BonusesService,
    ) {
        super(
            <IMixedParams<Params.IBonusModalCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            });
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.bonus = this.$params.bonus;

        this.prepareAlerts();

        if (this.showGames) {
            this.prepareGames();
        }

        if (this.configService.get<boolean>('$bonuses.useNewImageSources')) {
            this.bonusBgUrl = this.bonus.imageDescription ? `url(${this.bonus.imageDescription})` : '';
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
        return (this.showExpirationTimer || this.showSubscribeTimer) && !this.bonus.isExpired;
    }

    public get wagerParams(): IBonusWagerCParams {
        return this.$params.wagerParams;
    }

    public get showExpirationTimer(): boolean {
        return this.bonus.isActive || this.bonus.isLootbox;
    }

    public get showSubscribeTimer(): boolean {
        return this.bonus.isBonusTimerActive
            && this.bonus.canSubscribe
            && !this.bonus.showOnly
            && !this.bonus.stackIsUnavailable
            && !this.bonus.isDisabled;
    }

    public get isLootbox(): boolean {
        return this.bonus.target === 'lootbox';
    }

    public get showGames(): boolean {
        return !this.isLootbox || (this.isLootbox && this.bonus.event === 'bet' && !this.bonus.inventoried);
    }

    public get alerts(): IAlertCParams[] {
        return this._alerts;
    }

    public expandGames(): void {
        this.expandGames$.next();
    }

    protected async prepareGames(): Promise<void> {
        this.gamesAccordion = _merge(this.$params.gamesAccordionParams, {
            theme: this.$params.theme,
            items: [],
        });

        if (this.bonus.bonusType === 'sport') {
            const sportAccordionItem: IAccordionData = _merge(
                this.$params.gamesCommon,
                {wrapper: this.$params.sportBonusAccordionText},
            );
            this.gamesAccordion.items.push(sportAccordionItem);
            return;
        }

        this.isLoadingGames = true;
        this.bonusGamesAccordion = this.prepareGamesAccordionItem(this.$params.gamesCommon);
        this.gamesCatalogService = await this.injectionService.getService('games.games-catalog-service');

        await this.gamesCatalogService.ready;

        const bonusGames: Game[] = this.gamesCatalogService.getBonusGames(this.bonus.getGamesFilter());

        this.setGames(this.bonusGamesAccordion, bonusGames);
        this.gamesAccordion.items.push(this.bonusGamesAccordion);

        if (this.bonus.hasTarget('freerounds')) {
            this.prepareFreeroundGames();
        }

        this.isLoadingGames = false;
        this.cdr.markForCheck();
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

    protected prepareAlerts(): void {
        const alerts: IAlertCParams[] = [];
        const globalAlerts = this.configService.get<TBonusAlertsGlobal>('$bonuses.alertsConfig');

        if (this.bonus.isUnavailableForActivation && !!globalAlerts['unavailableActivationAlert']) {
            alerts.push(globalAlerts['unavailableActivationAlert']);
        }

        if (!Bonus.existActiveBonus
            && !(this.bonus.selected || this.bonus.inventoried)
            && this.bonus.allowStack
            && !!globalAlerts['allowStackAlert']
        ) {
            alerts.push(globalAlerts['allowStackAlert']);
        }

        if (this.bonus.isActive
            && this.bonus.disableCancel
            && !!globalAlerts['nonCancelableAlert']
        ) {
            alerts.push(globalAlerts['nonCancelableAlert']);
        }

        if (this.$params.alerts && this.$params.alerts.length) {
            alerts.push(...this.$params.alerts);
        }

        this._alerts = alerts;
    }
}
