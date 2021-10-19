import {IFromLog} from 'wlc-engine/modules/core';
import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';

import _assign from 'lodash-es/assign';
import _map from 'lodash-es/map';
import _isUndefined from 'lodash-es/isUndefined';

export interface IPragmaticResult {
    value: number;
    type: string;
}

export enum TBaccarat {
    'TIE' = 'green',
    'PLAYER_WIN' = 'red',
    'BANKER_WIN' = 'blue',
}

export type TWinner = 'TIE' | 'PLAYER_WIN' | 'BANKER_WIN';

export type TTableType = 'ROULETTE' | 'MEGAWHEEL' | 'SicBO' | 'BACCARAT' | 'BLACKJACK' | 'ONEBJ';

export interface IPragmaticRouletteResult {
    time: string;
    result: number;
    slot?: number;
    multiplier?: number;
    color?: string;
}

export interface IPragmaticSicBoResult {
    time: string;
    totalSum: number;
}

export interface IPragmaticGameResult {
    time: string;
    player: number;
    banker: number;
    winner: TWinner;
}

export interface PragmaticLiveData {
    totalSeatedPlayers: number;
    availableSeats?: number;
    tableLimits: {
        maxPlayers: number;
        maxBet: number;
        minBet: number;
        ranges?: number[];
    };
    dealer: {
        id?: string;
        name: string;
    };
    tableImage: string;
    tableName: string;
    languageSpecificTableInfo: string;
    tableOpen: boolean;
    tableId: string;
    newTable: boolean;
    tableType: TTableType;
    last20Results?: IPragmaticRouletteResult[] | IPragmaticSicBoResult[];
    gameResult?: IPragmaticGameResult[];
    currency: string;
    error?: string;
}

export class PragmaticLiveModel extends AbstractModel<PragmaticLiveData> {

    constructor(
        from: IFromLog,
        data: PragmaticLiveData,
    ) {
        super({from: _assign({model: 'PragmaticLiveModel'}, from)});
        this.data = data;
    }

    /**
     * total seated players
     */
    public get seated(): string {
        const count = +this.data.totalSeatedPlayers;

        if (count > 9) {
            return '9+';
        }
        return '' + count;
    }

    /**
     * get available seats if this field is present or max players
     */
    public get freePlaces(): string {

        if (_isUndefined(this.data.availableSeats)) {
            return '';
        }

        const count = +this.data.availableSeats;

        if (count > 999) {
            return '999+';
        }
        return '' + count;
    }

    /**
     * get string free/total place
     */
    public get freeFromPlaces(): string {

        if (!this.freePlaces) {
            return '';
        }

        if (this.totalPlaces) {
            return `${this.freePlaces}/${this.totalPlaces}`;
        }

        return this.freePlaces;
    }

    /**
     * get total places
     */
    public get totalPlaces(): number {
        if (_isUndefined(this.data.totalSeatedPlayers) || _isUndefined(this.data.availableSeats)) {
            return 0;
        }

        if (this.data.tableType === 'BLACKJACK') {
            return 7;
        }

        return 0 + this.data.totalSeatedPlayers + this.data.availableSeats;
    }

    /**
     * get table max playes
     */
    public get maxPlayers(): number {
        return this.data.tableLimits.maxPlayers;
    }

    /**
     * dealer name
     */
    public get dealer(): string {
        return this.data.dealer.name;
    }

    /**
     * table image
     */
    public get image(): string {
        return this.data.tableImage;
    }

    /**
     * table minimum bet
     */
    public get minBet(): number {
        return this.data.tableLimits.minBet;
    }

    /**
     * table maximum bet
     */
    public get maxBet(): number {
        return this.data.tableLimits.maxBet;
    }

    /**
     * get current data currecy
     */
    public get currency(): string {
        return this.data.currency;
    }

    /**
     * Table last result
     */
    public get lastResult(): IPragmaticResult[] {
        let res = [];

        switch (this.data.tableType) {
            case 'ROULETTE':
            case 'MEGAWHEEL':
                res = _map(this.data.last20Results, (item: IPragmaticRouletteResult) => {
                    return {
                        value: item.result,
                        type: item.color || 'black',
                    };
                });
                break;

            case 'SicBO':
                res = _map(this.data.last20Results, (item: IPragmaticSicBoResult) => {
                    return {
                        value: item.totalSum,
                        type: 'black',
                    };
                });
                break;

            case 'BACCARAT':
                res = _map(this.data.gameResult, (item) => {
                    return {
                        value: item.winner[0],
                        type: TBaccarat[item.winner],
                    };
                });
                break;
        }

        return res.slice(0, 10);
    }
}
