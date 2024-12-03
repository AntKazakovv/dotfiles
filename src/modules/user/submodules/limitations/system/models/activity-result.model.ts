import _assign from 'lodash-es/assign';

import {
    AbstractModel,
    IFromLog,
} from 'wlc-engine/modules/core';

import {IActivityResult} from 'wlc-engine/modules/user/submodules/limitations';

export class ActivityResultModel extends AbstractModel<IActivityResult> {

    constructor(
        from: IFromLog,
        data: IActivityResult,
        protected wallet: string,
    ) {
        super({from: _assign({model: 'ActivityResult'}, from)});
        this.data = data;

        if (!data) {
            this.data = {
                Bets: '0',
                Wins: '0',
                Deposits: '0',
                Losses: '0',
            };
        }
    }

    public get bets(): string {
        return this.data.Bets;
    }

    public get wins(): string {
        return this.data.Wins;
    }

    public get deposits(): string {
        return this.data.Deposits;
    }

    public get losses(): string {
        return this.data.Losses;
    }

    public get currency(): string {
        return this.wallet;
    }
}
