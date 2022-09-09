import _assign from 'lodash-es/assign';

import {
    AbstractModel,
    ConfigService,
    IFromLog,
} from 'wlc-engine/modules/core';
import {
    IBonusesModule,
    ILootboxPrize,
} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';

export class LootboxPrizeModel extends AbstractModel<ILootboxPrize> {
    public readonly termsClean: string;
    public readonly descriptionClean: string;

    protected static $bonuses: IBonusesModule;

    constructor(
        from: IFromLog,
        data: ILootboxPrize,
        protected configService: ConfigService,
    ) {
        super({from: _assign({model: 'Bonus'}, from)});
        this.data = data;

        if (!LootboxPrizeModel.$bonuses) {
            LootboxPrizeModel.$bonuses = this.configService.get<IBonusesModule>('$bonuses');
        }

        this.descriptionClean = this.data.Description.replace(/<[^>]*>/g, '');
        this.termsClean = this.data.Terms.replace(/<[^>]*>/g, '');
    }

    /**
     * get id
     *
     * @returns {number}
     */
    public get id(): number {
        return this.data.ID;
    }

    /**
     * get name
     *
     * @returns {string}
     */
    public get name(): string {
        return this.data.Name;
    }

    /**
     * get image for default profile
     *
     * @returns {string}
     */
    public get image(): string {
        return this.data.Image || LootboxPrizeModel.$bonuses.defaultImages?.image || '';
    }

    /**
     * get image for first profile
     *
     * @returns {string}
     */
    public get imageProfileFirst(): string {
        return this.data.Image || LootboxPrizeModel.$bonuses.defaultImages?.imageProfileFirst || '';
    }

    /**
     * get description
     *
     * @returns {string}
     */
    public get description(): string {
        return this.data.Description;
    }

    /**
     * get terms
     *
     * @returns {string}
     */
    public get terms(): string {
        return this.data.Terms;
    }
}
