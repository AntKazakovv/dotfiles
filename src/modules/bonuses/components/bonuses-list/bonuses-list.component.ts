import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import {EventService} from 'wlc-engine/modules/core/system/services';
import {Bonus} from '../../system/models/bonus';
import {LoyaltyBonusesService} from '../../system/services/loyalty-bonuses.service';
import * as Params from './bonuses-list.params';

import {
    merge as _merge,
    isString as _isString,
    union as _union,
} from 'lodash';

export {IBonusesListParams} from './bonuses-list.params';

@Component({
    selector: '[wlc-bonuses-list]',
    templateUrl: './bonuses-list.component.html',
    styleUrls: ['./styles/bonuses-list.component.scss'],
    preserveWhitespaces: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonusesListComponent extends AbstractComponent implements OnInit, OnDestroy {

    @Input() protected type: Params.Type;
    @Input() protected theme: Params.Theme;
    @Input() protected themeMod: Params.ThemeMod;
    @Input() protected customMod: Params.CustomMod;

    public $params: Params.IBonusesListParams;
    public bonuses: Bonus[];

    constructor(
        @Inject('injectParams') protected params: Params.IBonusesListParams,
        protected cdr: ChangeDetectorRef,
        protected ConfigService: ConfigService,
        protected loyaltyBonusesService: LoyaltyBonusesService,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<Params.IBonusesListParams>>{injectParams: params, defaultParams: Params.defaultParams}, ConfigService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.prepareModifiers();
        await this.loyaltyBonusesService.loadBonuses();
        this.bonuses = this.loyaltyBonusesService.allBonuses;
        this.cdr.detectChanges();
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params.common?.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }
}
