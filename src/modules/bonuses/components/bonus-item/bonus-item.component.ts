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
import {
    ModalService,
    EventService,
} from 'wlc-engine/modules/core/services';
import {Bonus} from '../../models/bonus';
import * as Params from './bonus-item.params';

import {
    merge as _merge,
    isString as _isString,
    union as _union,
    get as _get,
    isUndefined as _isUndefined,
    keys as _keys,
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
    @Input() protected type: Params.Type;
    @Input() protected theme: Params.Theme;
    @Input() protected themeMod: Params.ThemeMod;
    @Input() protected customMod: Params.CustomMod;
    @Input() protected view: string;

    public $params: Params.IBonusItemParams;
    public isAuth: boolean;
    public currency: string;
    public isChoose: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.IBonusItemParams,
        protected cdr: ChangeDetectorRef,
        protected ConfigService: ConfigService,
        protected modalService: ModalService,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<Params.IBonusItemParams>>{injectParams: params, defaultParams: Params.defaultParams}, ConfigService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.prepareParams());
        if (!this.view) {
            this.view = this.bonus.viewTarget || 'default';
        }
        this.prepareModifiers();
        this.isAuth = this.ConfigService.get<boolean>('$user.isAuthenticated');
        this.currency = this.ConfigService.get<string>('appConfig.user.currency') || 'EUR';
        this.eventService.subscribe({
            name: 'BONUS_SUBSCRIBE_SUCCEEDED',
        }, () => this.cdr.detectChanges(),
        this.$destroy);

        this.eventService.subscribe({
            name: 'BONUS_UNSUBSCRIBE_SUCCEEDED',
        }, () => this.cdr.detectChanges(),
        this.$destroy);

        this.eventService.subscribe({
            name: 'BONUS_CANCEL_SUCCEEDED',
        }, () => this.cdr.detectChanges(),
        this.$destroy);
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
        this.isChoose = true;
        this.eventService.emit({
            name: BonusItemComponentEvents[type],
            data: bonus,
        });
    }

    protected prepareParams(): Params.IBonusItemParams {
        const inlineParams: Params.IBonusItemParams = {
            common: {},
        };

        if (!_isUndefined(_get(this, 'type'))) {
            inlineParams.common.type = this.type;
        }

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
}
