import {
    AbstractModel,
} from 'wlc-engine/modules/core';
import {
    IBetradarGame,
    IMarketItem,
    MarketType,
} from 'wlc-engine/modules/sportsbook/system/interfaces/sportsbook.interface';

import _get from 'lodash-es/get';
import _forEach from 'lodash-es/forEach';

export class MarketModel extends AbstractModel<IBetradarGame> {

    public items: IMarketItem[] = [];

    constructor(
        data: IBetradarGame,
    ) {
        super();
        this.data = data;
        this.init();
    }

    /**
     * Market type
     *
     * @returns {MarketType}
     */
    public get type(): MarketType {
        return _get(this.data, 'market') as MarketType;
    }

    protected init(): void {
        if (this.type == MarketType.P1xP2 || this.type == MarketType.P1P2) {
            _forEach(['p1', 'x', 'p2'], (marketName: string, index: number) => {
                const marketValue: string = _get(this.data, marketName, '');

                if (marketValue) {
                    this.items.push({
                        name: ['1', 'x', '2'][index],
                        value: marketValue,
                    });
                }
            });
        }
    }
}
