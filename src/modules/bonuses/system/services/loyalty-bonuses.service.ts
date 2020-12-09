import {Injectable} from '@angular/core';
import {DataService, IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {Bonus} from '../models/bonus';
import {IBonus} from '../interfaces/bonuses.interface';
import {ConfigService, EventService} from 'wlc-engine/modules/core/system/services';

import {
    filter as _filter,
    includes as _includes,
    extend as _extend,
} from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class LoyaltyBonusesService {
    public bonuses: Bonus[] = [];

    constructor(
        protected dataService: DataService,
        protected eventService: EventService,
        protected configService: ConfigService,
    ) {
        this.registerMethods();
        this.loadBonuses();
    }

    public get allBonuses(): Bonus[] {
        return this.bonuses || [];
    }

    public get mainBonuses(): Bonus[] {
        return _filter(this.bonuses, (item: Bonus) => {
            return !item.active && !item.inventoried && (!item.promoCode || (item.promoCode && item.selected));
        });
    }

    public get activeBonuses(): Bonus[] {
        return _filter(this.bonuses, (item: Bonus) => {
            return item.active;
        });
    }

    public get inventoriedBonuses(): Bonus[] {
        return _filter(this.bonuses, (item: Bonus) => {
            return item.inventoried && item.selected && !item.active;
        });
    }

    public get regBonuses(): Bonus[] {
        const regEvents = ['deposit', 'deposit first', 'deposit repeated', 'deposit sum', 'registration'];
        return _filter(this.mainBonuses, (item: Bonus) => {
            return _includes(regEvents, item.event) && item.canSubscribe;
        });
    }

    public get depositBonuses(): Bonus[] {
        const depEvents = ['deposit', 'deposit first', 'deposit repeated', 'deposit sum'];
        return _filter(this.mainBonuses, (item: Bonus) => {
            return _includes(depEvents, item.event) && item.canSubscribe;
        });
    }

    public async loadBonuses(): Promise<void> {
        this.bonuses = await this.dataService.request('bonuses/bonuses')
            .then((data: IData) => this.modifyBonuses(data.data));
    }

    public async getBonusesByCode(code: string): Promise<Bonus[]> {
        return null;
    }

    public async getBonusById(id: number): Promise<Bonus[]> {
        return null;
    }

    public async subscribeBonus(bonus: Bonus): Promise<void> {
        bonus.data.PromoCode = bonus.data.PromoCode || '';
        const params = {ID: bonus.id, PromoCode: bonus.promoCode, Selected: 1};

        await this.dataService.request({
            name: 'bonusSubscribe',
            system: 'bonuses',
            url: `/bonuses/${bonus.id}`,
            type: 'POST',
        }, params).then((response: IData) => {
            _extend(bonus.data, response.data);
            this.eventService.emit({
                name: 'BONUS_SUBSCRIBE_SUCCEEDED',
                data: bonus,
            });
        }).catch((error) => {
            this.eventService.emit({
                name: 'BONUS_SUBSCRIBE_FAILED',
                data: error,
            });
            // TODO: showModal
        });
    }

    public async unsubscribeBonus(bonus: Bonus): Promise<void> {
        const params = {ID: bonus.id, Selected: 0};

        await this.dataService.request({
            name: 'bonusSubscribe',
            system: 'bonuses',
            url: `/bonuses/${bonus.id}`,
            type: 'POST',
        }, params).then((response: IData) => {
            _extend(bonus.data, response.data);
            this.eventService.emit({
                name: 'BONUS_UNSUBSCRIBE_SUCCEEDED',
                data: bonus,
            });
        }).catch((error) => {
            this.eventService.emit({
                name: 'BONUS_UNSUBSCRIBE_FAILED',
                data: error,
            });
            // TODO: showModal
        });
    }

    public async cancelBonus(bonus: Bonus): Promise<void> {
        await this.dataService.request({
            name: 'bonusSubscribe',
            system: 'bonuses',
            url: `/bonuses/${bonus.id}`,
            type: 'DELETE',
        }).then((response: IData) => {
            _extend(bonus.data, response.data);
            bonus.data.Status = 0;
            this.eventService.emit({
                name: 'BONUS_CANCEL_SUCCEEDED',
                data: bonus,
            });
        }).catch((error) => {
            this.eventService.emit({
                name: 'BONUS_CANCEL_FAILED',
                data: error,
            });
            // TODO: showModal
        });
    }

    protected modifyBonuses(data: IBonus[]): Bonus[] {
        const queryBonuses: Bonus[] = [];

        if (data?.length) {
            for (const bonusData of data) {
                const bonus: Bonus = new Bonus(bonusData, this.configService, this);
                queryBonuses.push(bonus);
            }
        }
        return _filter(queryBonuses, (bonus: Bonus) => {
            return bonus.allowCatalog || (!bonus.allowCatalog && (bonus.selected || bonus.active));
        });
    }

    protected registerMethods(): void {
        this.dataService.registerMethod({
            name: 'bonuses',
            system: 'bonuses',
            url: '/bonuses',
            type: 'GET',
            events: {
                success: 'BONUSES_SUCCESS',
                fail: 'BONUSES_ERROR',
            },
        });
    }
}
