import {TranslateService} from '@ngx-translate/core';

import _toNumber from 'lodash-es/toNumber';
import _assign from 'lodash-es/assign';
import _isObject from 'lodash-es/isObject';

import {
    AbstractModel,
    IFromLog,
} from 'wlc-engine/modules/core';
import {ILevel} from 'wlc-engine/modules/loyalty/system/interfaces';

export class LoyaltyLevelModel extends AbstractModel<ILevel> {

    constructor(
        from: IFromLog,
        data: ILevel,
        public readonly isLast: boolean,
        protected translate: TranslateService,
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
        if (_isObject(this.data.Image)) {
            return this.data.Image[this.translate.currentLang];
        }

        return this.data.Image;
    }

    /**
     * Level description
     * @returns {string}
     */
    public get description(): string {
        if (_isObject(this.data.Description)) {
            return this.data.Description[this.translate.currentLang];
        }

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
     * Points to current level
     * @returns {number}
     */
    public get currentLevelPoints(): number {
        return _toNumber(this.data.CurrentLevelPoints) || 0;
    }

    /**
     * Points to next level
     * @returns {number}
     */
    public get nextLevelPoints(): number {
        return _toNumber(this.data.NextLevelPoints) || 0;
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
