import _assign from 'lodash-es/assign';
import {AbstractModel, IFromLog} from 'wlc-engine/modules/core';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';


export type BetType = 'bet' | 'win' | 'zerocredit';

export interface ILatestBetData {
    GameID: string;
    Currency: string;
    MaskedUserName: string;
    Type?: BetType;
    Amount: number;
    AmountEUR?: number;
    BetAmount: number;
    BetAmountEUR?: number;
    Multiplier?: number;
}

export class LatestBetsModel extends AbstractModel<ILatestBetData> {

    constructor(
        from: IFromLog,
        data: ILatestBetData,
        protected gamesCatalogService: GamesCatalogService,
    ) {
        super({from: _assign({model: 'LatestBetsModel'}, from)});
        this.data = data;
    }

    public get userName(): string {
        return this.data.MaskedUserName;
    }

    public get betAmount(): number {
        return this.data.BetAmount;
    }

    public get betAmountEUR(): number {
        return this.data.BetAmountEUR;
    }

    public get multiplier(): number {
        return this.data.Multiplier;
    }

    public get profitAmount(): number {
        return this.data.Amount;
    }

    public get currency(): string {
        return this.data.Currency.toLowerCase();
    }

    public get gameID(): string {
        return this.data.GameID;
    }

    public get game(): Game {
        return this.gamesCatalogService.getGameById(+this.data.GameID);
    }

    public get betType(): string {
        return this.data.Type;
    }

    public get currencyIconPath(): string {
        return '/wlc/icons/currencies/' + this.currency + '.svg';
    }
}
