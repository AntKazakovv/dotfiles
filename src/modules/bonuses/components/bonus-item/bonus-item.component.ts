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
} from 'wlc-engine/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import {ModalService} from 'wlc-engine/modules/base/services';
import {EventService} from 'wlc-engine/modules/core/services';
import {Bonus} from '../../models/bonus';
import * as BIParams from './bonus-item.params';

import {
    merge as _merge,
    isString as _isString,
    union as _union,
} from 'lodash';

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

    @Input() public bonus: Bonus;
    @Input() protected type: BIParams.Type;
    @Input() protected theme: BIParams.Theme;
    @Input() protected themeMod: BIParams.ThemeMod;
    @Input() protected customMod: BIParams.CustomMod;
    @Input() protected view: string;

    public $params: BIParams.IBonusItemParams;
    public isAuth: boolean;
    public currency: string;
    public isChoose: boolean = false;

    constructor(
        @Inject('injectParams') protected params: BIParams.IBonusItemParams,
        protected cdr: ChangeDetectorRef,
        protected ConfigService: ConfigService,
        protected modalService: ModalService,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<BIParams.IBonusItemParams>>{injectParams: params, defaultParams: BIParams.defaultParams}, ConfigService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.prepareParams());
        if (!this.view) {
            this.view = this.bonus.viewTarget || 'default';
        }
        this.prepareModifiers();
        this.isAuth = this.ConfigService.get<boolean>('$user.isAuthenticated');
        this.currency = this.ConfigService.get<string>('appConfig.user.currency') || 'EUR';
    }

    public getBonusTag(): string {
        if (this.bonus.isActive) {
            return 'Active';
        }
        if (this.bonus.isSubscribed) {
            return 'Subscribed';
        }

        if (this.bonus.inventoried) {
            return 'Inventoried';
        }
        return this.bonus.group;
    }

    public openDescription(bonusId: number): void {
        this.modalService.showModal('baseInfo');
    }

    public chooseBonus(bonus: Bonus, type: string): void {
        // TODO: add global trigger
        this.isChoose = true;
        this.eventService.emit({
            name: BonusItemComponentEvents[type],
            data: bonus,
        });
    }

    protected prepareParams(): BIParams.IBonusItemParams {
        const inlineParams: BIParams.IBonusItemParams = {
            common: {},
        };
        if (this.type) {
            inlineParams.common.type = this.type;
        }
        return inlineParams;
    }

    protected prepareModifiers(): void {
        let modifiers: BIParams.Modifiers[] = [];
        modifiers.push(`view-${this.view}`);

        if (this.$params.common.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }
}
