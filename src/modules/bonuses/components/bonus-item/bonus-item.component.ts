import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    CachingService,
    ConfigService,
} from 'wlc-engine/modules/core';
import {
    ModalService,
    EventService,
} from 'wlc-engine/modules/core/system/services';
import {Bonus} from '../../system/models/bonus';
import {BonusesService} from '../../system/services';
import * as Params from './bonus-item.params';

import {
    merge as _merge,
    isString as _isString,
    union as _union,
    get as _get,
    isUndefined as _isUndefined,
    keys as _keys,
    forEach as _forEach,
} from 'lodash-es';

export {IBonusItemParams} from './bonus-item.params';
export const BonusItemComponentEvents: IBonusItemComponentEvents = {
    reg: 'CHOOSE_REG_BONUS_SUCCEEDED',
    deposit: 'CHOOSE_DEPOSIT_BONUS_SUCCEEDED',
};

interface IBonusItemComponentEvents {
    reg: string;
    deposit: string;
}

@Component({
    selector: '[wlc-bonus-item]',
    templateUrl: './bonus-item.component.html',
    styleUrls: ['./styles/bonus-item.component.scss'],
    preserveWhitespaces: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class BonusItemComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() public inlineParams: Params.IBonusItemParams;
    @Input() public bonus: Bonus;
    @Input() public type: Params.Type;
    @Input() public theme: Params.Theme;
    @Input() public themeMod: Params.ThemeMod;
    @Input() public customMod: Params.CustomMod;
    @Input() public view: string;
    @Input() public chosen: boolean;

    public $params: Params.IBonusItemParams;
    public isAuth: boolean;
    public currency: string;
    public isNoChooseBtn: boolean;
    public isChooseBtn: boolean;
    public isTypeRegDeposit: boolean;

    constructor(
        @Inject('injectParams') protected params: Params.IBonusItemParams,
        protected cachingService: CachingService,
        protected cdr: ChangeDetectorRef,
        protected ConfigService: ConfigService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected bonusesService: BonusesService,
    ) {
        super(
            <IMixedParams<Params.IBonusItemParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, ConfigService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.prepareParams());

        if (this.$params.bonus) {
            this.$params.common.bonus = this.$params.bonus;
            this.bonus = this.$params.bonus;
        }
        if (!this.view) {
            this.view = this.$params.common.bonus.viewTarget || 'default';
        }

        this.prepareModifiers();
        this.isAuth = this.ConfigService.get<boolean>('$user.isAuthenticated');
        this.currency = this.ConfigService.get<string>('appConfig.user.currency') === 'EUR' ?
            '€' : this.ConfigService.get<string>('appConfig.user.currency');
        this.isTypeRegDeposit = this.$params.common?.type === 'reg' || this.$params.common?.type === 'deposit';
        this.isNoChooseBtn = this.$params.common?.hideChooseBtn && this.isTypeRegDeposit;
        this.isChooseBtn = !this.$params.common?.hideChooseBtn && this.isTypeRegDeposit;
    }

    public getBonusTag(): string {
        if (this.$params.common.bonus.isActive) {
            return 'Active';
        }
        if (this.$params.common.bonus.isSubscribed) {
            return 'Subscribed';
        }

        if (this.$params.common.bonus.inventoried) {
            return 'Inventoried';
        }
        return this.$params.common.bonus.group;
    }

    public openDescription(bonus: Bonus): void {
        this.modalService.showModal({
            id: 'bonus-info',
            modalTitle: bonus.name,
            modifier: 'info',
            modalMessage: [
                bonus.description,
            ],
            dismissAll: true,
        });
    }

    public chooseBonusNoBtn(bonus: Bonus, type: string): void {
        if (!this.isChooseBtn) {
            this.chooseBonus(bonus, type);
        }
    }

    public chooseBonus(bonus: Bonus, type: string): void {
        this.$params.common.bonus.isChoose = true;
        this.eventService.emit({
            name: BonusItemComponentEvents[type],
            data: bonus,
        });
        this.cdr.markForCheck();
    }

    public async getInventory(): Promise<void> {
        this.bonus = await this.bonusesService.takeInventory(this.bonus);
        if (this.bonus) {
            this.cdr.markForCheck();
        }
    }

    public async join(): Promise<void> {
        this.bonus = await this.bonusesService.subscribeBonus(this.bonus);
        if (this.bonus) {
            this.bonusesService.clearPromoBonus();
            this.cdr.markForCheck();
        }
    }

    public async leave(): Promise<void> {
        this.bonus = await this.bonusesService.cancelBonus(this.bonus);
        if (this.bonus) {
            this.cdr.markForCheck();
        }
    }

    public async unsubscribe(): Promise<void> {
        this.bonus = await this.bonusesService.unsubscribeBonus(this.bonus);

        if (this.bonus) {
            this.sendEvent('UNSUBSCRIBE_FROM_BONUS', this.bonus);
            this.cdr.markForCheck();
        }
    }

    public getValueLengthClass(value: number): string {
        const strLength = value && value.toString().length;
        if (strLength > 4 && strLength < 7) {
            return 'small';
        } else if (strLength >= 7) {
            return 'smaller';
        } else {
            return 'default';
        }
    }

    protected prepareParams(): Params.IBonusItemParams {
        const inputProperties: string[] = ['bonus', 'type', 'theme', 'themeMod', 'customMod', 'view', 'chosen'];
        const inlineParams: Params.IBonusItemParams = {
            common: {},
        };

        _forEach(inputProperties, key => {
            if (!_isUndefined(_get(this, key))) {
                inlineParams.common[key] = _get(this, key);
            }
        });

        return _keys(inlineParams.common).length ? inlineParams : null;
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        modifiers.push(`view-${this.view}`);

        if (this.$params.common?.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }

    protected sendEvent(eventName, data): void {
        this.eventService.emit({
            name: eventName,
            data,
        });
    }
}
