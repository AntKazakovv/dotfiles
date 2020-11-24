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
import * as BIParams from './bonus-item.params';
import {ConfigService} from 'wlc-engine/modules/core';

import {
    merge as _merge,
    isString as _isString,
    union as _union,
} from 'lodash';
import {Bonus} from '../../models/bonus';

export {IBonusItemParams} from './bonus-item.params';

@Component({
    selector: '[wlc-bonus-item]',
    templateUrl: './bonus-item.component.html',
    styleUrls: ['./styles/bonus-item.component.scss'],
    preserveWhitespaces: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonusItemComponent extends AbstractComponent implements OnInit, OnDestroy {

    @Input() public bonus: Bonus;
    @Input() protected type: BIParams.Type;
    @Input() protected theme: BIParams.Theme;
    @Input() protected themeMod: BIParams.ThemeMod;
    @Input() protected customMod: BIParams.CustomMod;

    public $params: BIParams.IBonusItemParams;

    constructor(
        @Inject('injectParams') protected params: BIParams.IBonusItemParams,
        protected cdr: ChangeDetectorRef,
        protected ConfigService: ConfigService,
    ) {
        super(
            <IMixedParams<BIParams.IBonusItemParams>>{injectParams: params, defaultParams: BIParams.defaultParams}, ConfigService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.prepareModifiers();
    }

    protected prepareModifiers(): void {
        let modifiers: BIParams.Modifiers[] = [];
        if (this.$params.common.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }
}
