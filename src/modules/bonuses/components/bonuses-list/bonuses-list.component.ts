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
import {BonusesService} from '../../system/services';
import * as Params from './bonuses-list.params';

import {
    merge as _merge,
    isString as _isString,
    union as _union,
    get as _get,
    isUndefined as _isUndefined,
    keys as _keys,
    isObject as _isObject,
} from 'lodash';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';

export {IBonusesListCParams} from './bonuses-list.params';

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
    @Input() protected inlineParams: Params.IBonusesListCParams;

    public $params: Params.IBonusesListCParams;
    public bonuses: Bonus[] = [];
    public isReady: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.IBonusesListCParams,
        protected cdr: ChangeDetectorRef,
        protected ConfigService: ConfigService,
        protected bonusesService: BonusesService,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<Params.IBonusesListCParams>>{injectParams: params, defaultParams: Params.defaultParams}, ConfigService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.prepareModifiers();
        this.isReady = false;

        this.bonusesService.getSubscribe({
            useQuery: true,
            observer: {
                next: (bonuses: Bonus[]) => {
                    if (bonuses) {
                        this.bonuses = this.bonusesService.filterBonuses(bonuses, this.$params.common?.filter);
                        this.isReady = true;
                    }
                    this.cdr.markForCheck();
                },
            },
            type: this.$params.common?.restType,
            until: this.$destroy,
        });
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params.common?.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }
}
