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
    CachingService,
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {
    ISliderCParams,
    ISlide,
} from 'wlc-engine/modules/promo/components/slider/slider.params';
import {SliderComponent} from 'wlc-engine/modules/promo/components/slider/slider.component';
import {BonusItemComponent} from '../bonus-item/bonus-item.component';
import {Bonus} from '../../system/models/bonus';
import {BonusesService} from '../../system/services';
import * as Params from './bonuses-list.params';

import {
    merge as _merge,
    isNumber as _isNumber,
    union as _union,
    unionBy as _unionBy,
    each as _each,
    reduce as _reduce,
    filter as _filter,
    find as _find,
    concat as _concat,
    isObject as _isObject,
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

    protected promocode: string = '';

    constructor(
        @Inject('injectParams') protected params: Params.IBonusesListCParams,
        protected bonusesService: BonusesService,
        protected cachingService: CachingService,
        protected ConfigService: ConfigService,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<Params.IBonusesListCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, ConfigService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.prepareModifiers();

        if (!this.bonusesService.promoBonus) {
            await this.checkPromoBonus();
        }

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
        this.slides = bonuses?.map((item: Bonus) => {
            return {
                component: BonusItemComponent,
                componentParams: _merge(
                    {theme: this.$params.theme},
                    {type: this.$params.common.filter},
                    {bonus: item},
                    {wlcElement: 'block_bonus'},
                ),
            };
        });

        if (this.slider?.swiper) {
            this.slider.swiper.swiperRef.slideTo(0);
        }
        this.cdr.markForCheck();
    }

    protected sortBonuses(): Bonus[] {
        if (!this.$params.common?.sortOrder) {
            return this.bonuses;
        }

        if (!this.bonuses.length) return;

        this.addPromoBonus();

        const result = _reduce(_union(this.$params.common.sortOrder), (res, element) => {
            if (_isNumber(element)) {
                return _unionBy(res, [_find(this.bonuses, (bonus) => bonus.id === element)], 'id');
            } else {
                switch (element) {
                    case 'active':
                        return _unionBy(res, _filter(this.bonuses, (bonus) => bonus.isActive), 'id');
                    case 'subscribe':
                        return _unionBy(res, _filter(this.bonuses, (bonus) => bonus.isSubscribed), 'id');
                    case 'inventory':
                        return _unionBy(res, _filter(this.bonuses, (bonus) => bonus.inventoried), 'id');
                    default:
                        return _unionBy(res, this.bonuses, 'id');
                }
            }
        }, []);

        return (result.length === this.bonuses.length)
            ? result : _unionBy(result, this.bonuses, 'id');
    }

    protected prepareBonuses(): void {
        this.bonuses = this.sortBonuses();
        this.checkBonuses();
        if (this.$params.type === 'swiper' && this.bonuses?.length) {
            this.bonusesToSlides(this.bonuses);
        }
    }

    protected addPromoBonus(): void {
        if (!this.bonusesService.promoBonus) return;

        this.bonuses = _concat(this.bonusesService.promoBonus, this.bonuses);
        this.$params.common.sortOrder = _concat(this.bonusesService.promoBonus.id, this.$params.common.sortOrder);
    }


    protected async checkPromoBonus(): Promise<void> {
        this.promocode = await this.cachingService.get(this.bonusesService.dbPromoUrl);

        if (!this.promocode) return;

        const bonus: Bonus[] = await this.bonusesService.getBonusesByCode(this.promocode);
        this.bonusesService.promoBonus = bonus[0];
    }

    protected checkBonuses() {
        this.bonuses = _filter(this.bonuses, (bonus: Bonus) => _isObject(bonus));
    }
}
