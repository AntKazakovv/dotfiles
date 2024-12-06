import _assign from 'lodash-es/assign';

import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {IFromLog} from 'wlc-engine/modules/core/system/services/log/log.service';
import {
    IBonusesModule,
    ILootboxPrize,
} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';

export class LootboxPrizeModel extends AbstractModel<ILootboxPrize> {
    public readonly id: number;
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

        this.id = +this.data.ID; //TODO Remove conversion to number and make it a getter again after release #677535
        this.descriptionClean = GlobalHelper.deleteHTMLTags(this.data.Description);
        this.termsClean = GlobalHelper.deleteHTMLTags(this.data.Terms);
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

    public get imagePromo(): string {
        return this.data.Image_promo || LootboxPrizeModel.$bonuses.defaultImages?.imagePromo || this.image || '';
    }

    /**
     * get image other
     *
     * @returns {string}
     */
    public get imageOther(): string {
        return this.data.Image_other || '';
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
