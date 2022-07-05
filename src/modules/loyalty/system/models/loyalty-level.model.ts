import _toNumber from 'lodash-es/toNumber';
import _assign from 'lodash-es/assign';

import {
    AbstractModel,
    IFromLog,
} from 'wlc-engine/modules/core';
import {ILevel} from 'wlc-engine/modules/loyalty/system/interfaces';

export class LoyaltyLevelModel extends AbstractModel<ILevel> {

    constructor(
        from: IFromLog,
        data: ILevel,
    ) {
        super({from: _assign({model: 'LoyaltyLevelModel'}, from)});
        this.data = data;
    }

    /**
     * Level name
     * @returns {string}
     */
    public get name(): string {
        return this.data.Name;
    }

    /**
     * Level image
     * @returns {string}
     */
    public get image(): string {
        return this.data.Image;
    }

    /**
     * Level description
     * @returns {string}
     */
    public get description(): string {
        return this.data.Description;
    }

    /**
     * Level number
     * @returns {number}
     */
    public get level(): number {
        return _toNumber(this.data.Level);
    }

    /**
     * Points to next level
     * @returns {number}
     */
    public get nextLevelPoints(): number {
        return _toNumber(this.data.NextLevelPoints);
    }

    /**
     * Coefficient points
     * @returns {number}
     */
    public get coef(): number {
        return _toNumber(this.data.Coef);
    }

    /**
     * Confirm points
     * @returns {number}
     */
    public get confirmPoints(): number {
        return _toNumber(this.data.ConfirmPoints);
    }
}
