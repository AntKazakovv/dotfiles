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
} from 'wlc-engine/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import {Bonus} from '../../models/bonus';
import {LoyaltyBonusesService} from '../../services/loyalty-bonuses.service';
import * as BListParams from './bonuses-list.params';

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

    @Input() protected type: BListParams.Type;
    @Input() protected theme: BListParams.Theme;
    @Input() protected themeMod: BListParams.ThemeMod;
    @Input() protected customMod: BListParams.CustomMod;

    public $params: BListParams.IBonusesListParams;
    public bonuses: Bonus[];

    constructor(
        @Inject('injectParams') protected params: BListParams.IBonusesListParams,
        protected cdr: ChangeDetectorRef,
        protected ConfigService: ConfigService,
        protected loyaltyBonusesService: LoyaltyBonusesService,
    ) {
        super(
            <IMixedParams<BListParams.IBonusesListParams>>{injectParams: params, defaultParams: BListParams.defaultParams}, ConfigService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.prepareModifiers();
        await this.loyaltyBonusesService.loadBonuses();
        this.bonuses = this.loyaltyBonusesService.allBonuses;
        // console.log(this.bonuses);
        this.cdr.detectChanges();
    }

    protected prepareModifiers(): void {
        let modifiers: BListParams.Modifiers[] = [];
        if (this.$params.common.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }
}
