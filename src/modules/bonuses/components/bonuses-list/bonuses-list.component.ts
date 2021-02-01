import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ISliderCParams,
    ISlide,
} from 'wlc-engine/modules/promo/components/slider/slider.params';
import {SliderComponent} from 'wlc-engine/modules/promo/components/slider/slider.component';
import {BonusItemComponent} from '../bonus-item/bonus-item.component';
import {ConfigService} from 'wlc-engine/modules/core';
import {EventService} from 'wlc-engine/modules/core/system/services';
import {Bonus} from '../../system/models/bonus';
import {BonusesService} from '../../system/services';
import * as Params from './bonuses-list.params';

import {
    merge as _merge,
    isString as _isString,
    isNumber as _isNumber,
    union as _union,
    unionBy as _unionBy,
    get as _get,
    isUndefined as _isUndefined,
    keys as _keys,
    isObject as _isObject,
    each as _each,
    reduce as _reduce,
    filter as _filter,
    find as _find,
} from 'lodash-es';

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
    @ViewChild(SliderComponent) public slider: SliderComponent;

    public $params: Params.IBonusesListCParams;
    public bonuses: Bonus[] = [];
    public isReady: boolean = false;
    public sliderParams: ISliderCParams = {
        swiper: {},
    };
    public slides: ISlide[] = [];

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
        if (this.$params.type === 'swiper') {
            this.sliderParams.swiper = this.$params.common?.swiper;
        }

        this.bonusesService.getSubscribe({
            useQuery: true,
            observer: {
                next: (bonuses: Bonus[]) => {
                    if (bonuses) {
                        this.bonuses = this.bonusesService.filterBonuses(bonuses, this.$params.common?.filter);
                        this.isReady = true;
                    }
                    this.prepareBonuses();
                    this.cdr.markForCheck();
                },
            },
            type: this.$params.common?.restType,
            until: this.$destroy,
        });

        this.eventService.subscribe([
            {name: 'CHOOSE_REG_BONUS_SUCCEEDED'},
            {name: 'CHOOSE_DEPOSIT_BONUS_SUCCEEDED'},
        ], (bonus: Bonus) => {
            _each(this.bonuses, (item: Bonus) => {
                if (item.id !== bonus.id) {
                    item.isChoose = false;
                }
            });
            this.prepareBonuses();
            this.cdr.detectChanges();
        }, this.$destroy);
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params.common?.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }

    protected bonusesToSlides(bonuses: Bonus[]): void {
        this.slides = bonuses.map((item: Bonus) => {
            return {
                component: BonusItemComponent,
                componentParams: _merge(
                    {theme: this.$params.theme},
                    {type: this.$params.common.filter},
                    {bonus: item},
                ),
            };
        });

        if (this.slider?.swiper) {
            this.slider.swiper.swiper().slideTo(0);
        }
        this.cdr.markForCheck();
    }

    protected sortBonuses(bonuses: Bonus[]): Bonus[] {
        if (!this.$params.common?.sortOrder) {
            return bonuses;
        }

        const result = _reduce(this.$params.common.sortOrder, (res, element) => {
            if (_isNumber(element)) {
                return _unionBy(res, [_find(bonuses, (bonus) => bonus.id === element)], 'id');
            } else {
                switch (element) {
                    case 'active':
                        return _unionBy(res, _filter(bonuses, (bonus) => bonus.isActive), 'id');
                    case 'subscribe':
                        return _unionBy(res, _filter(bonuses, (bonus) => bonus.isSubscribed), 'id');
                    case 'inventory':
                        return _unionBy(res, _filter(bonuses, (bonus) => bonus.inventoried), 'id');
                    default:
                        return _unionBy(res, bonuses, 'id');
                }
            }
        }, []);

        return (result.length === bonuses.length)
            ? result : _unionBy(result, bonuses, 'id');
    }

    protected prepareBonuses(): void {
        this.bonuses = this.sortBonuses(this.bonuses);
        if (this.$params.type === 'swiper') {
            this.bonusesToSlides(this.bonuses);
        }
    }
}
