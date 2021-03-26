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
    IData,
} from 'wlc-engine/modules/core';
import {
    ISliderCParams,
    ISlide,
} from 'wlc-engine/modules/promo/components/slider/slider.params';
import {SliderComponent} from 'wlc-engine/modules/promo/components/slider/slider.component';
import {
    Bonus,
    BonusesService,
    BonusItemComponentEvents,
    ChosenBonusSetParams,
    ChosenBonusType,
} from 'wlc-engine/modules/bonuses';
import {BonusItemComponent} from '../bonus-item/bonus-item.component';
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
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<Params.IBonusesListCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public get chosenBonus(): Bonus {
        return _find(this.bonuses, ({isChoose}) => isChoose);
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
            useQuery: !this.bonusesService.hasBonuses,
            observer: {
                next: (bonuses: Bonus[]) => {
                    if (bonuses) {
                        this.bonuses = this.bonusesService.filterBonuses(bonuses, this.$params.common?.filter);
                        this.isReady = true;

                        const chosenBonus = this.configService.get<ChosenBonusType>(ChosenBonusSetParams.ChosenBonus);

                        if (chosenBonus?.id) {
                            _find(this.bonuses, (item: Bonus) => {
                                if (item.id === chosenBonus.id) {
                                    item.isChoose = true;
                                    return true;
                                }
                            });
                        } else if (!this.selectFirstBonus && chosenBonus?.id === null) {
                            this.chooseBlankBonus();
                        } else if (this.selectFirstBonus && !this.chosenBonus) {
                            this.chooseFirstBonus();
                        }
                    }

                    if (this.$params.common?.useBlankBonus) {
                        const blankBonus: any = {
                            id: null,
                            type: 'blank',
                            isChoose: !this.chosenBonus,
                            name: gettext('Without bonus'),
                        };
                        this.bonuses.push(blankBonus);
                    }

                    this.prepareBonuses();
                    if (this.$params.type === 'swiper' && this.bonuses.length) {

                        this.bonusesToSlides(this.bonuses);
                    }
                    this.cdr.markForCheck();
                },
            },
            type: this.$params.common?.restType,
            until: this.$destroy,
        });

        this.setSubscription();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.unchooseBonuses();
    }

    public chooseBlankBonus(): void {
        this.unchooseBonuses();
        setTimeout(() => {
            const isChosenBonus = _find(this.bonuses, ({isChoose}) => isChoose);

            _each(this.bonuses, bonus => {
                if (!isChosenBonus && bonus.type === 'blank') {
                    bonus.isChoose = true;
                }
            });
            this.cdr.markForCheck();
        }, 0);

        this.configService.set<ChosenBonusType>({
            name: ChosenBonusSetParams.ChosenBonus,
            value: {id: null},
        });

        this.eventService.emit({name: BonusItemComponentEvents.blank});
    }

    protected setSubscription(): void {
        this.eventService.subscribe([
            {name: BonusItemComponentEvents.reg},
            {name: BonusItemComponentEvents.deposit},
        ], (bonus: Bonus) => {
            _each(this.bonuses, (item: Bonus) => {
                if (item.id !== bonus.id) {
                    item.isChoose = false;
                }
            });

            if (this.slider) {
                this.bonusesToSlides(this.bonuses, false);
            }

            this.prepareBonuses();

            const allowedBonus: boolean = !!_find(this.bonuses, ({id}: Bonus) => id === bonus.id);

            if (!allowedBonus && this.selectFirstBonus) {
                return this.chooseFirstBonus();
            } else if (!allowedBonus && !this.selectFirstBonus) {
                return this.chooseBlankBonus();
            }
            this.configService.set<ChosenBonusType>({
                name: ChosenBonusSetParams.ChosenBonus,
                value: bonus,
            });
            this.cdr.markForCheck();
        }, this.$destroy);

        this.eventService.subscribe({name: 'hidden.bs.modal'}, (name: string) => {
            if (name === 'signup') {
                this.chooseBlankBonus();
            }
        }, this.$destroy);

        this.eventService.subscribe({name: 'CHOOSE_BLANK_BONUS'}, () => {
            this.chooseBlankBonus();

            _each(this.bonuses, bonus => {
                if (bonus.type === 'blank') {
                    bonus.isChoose = true;
                }
            });

            if (this.slider) {
                this.bonusesToSlides(this.bonuses, false);
            }

            this.cdr.markForCheck();
        }, this.$destroy);

        if (this.$params.type === 'swiper') {
            this.eventService.subscribe([
                {name: 'LOGIN'},
                {name: 'LOGOUT'},
                {name: 'PROFILE_UPDATE'},
                {name: 'BONUS_TAKE_SUCCEEDED'},
                {name: 'BONUS_CANCEL_SUCCEEDED'},
            ], () => {
                if (this.bonuses?.length) {
                    this.bonusesToSlides(this.bonuses, true);
                }
            }, this.$destroy);

            this.eventService.subscribe([
                {name: 'BONUS_SUBSCRIBE_SUCCEEDED'},
            ], (bonus: IData) => {
                if (bonus?.data?.event === 'sign up' && this.bonuses?.length) {
                    this.bonusesToSlides(this.bonuses, true);
                }
            }, this.$destroy);
        }
    }

    protected get selectFirstBonus(): boolean {
        return this.$params?.common.selectFirstBonus;
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params.common?.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        this.addModifiers(modifiers);
    }

    protected bonusesToSlides(bonuses: Bonus[], scroll?: boolean): void {
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

        if (this.slider?.swiper && scroll) {
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
        if (this.$params.common?.filterByGroup) {
            this.bonuses = _filter(this.bonuses, (bonus) => bonus.data.Group === this.$params.common.filterByGroup);
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

    protected chooseFirstBonus(): void {
        if (this.bonuses.length) {
            this.bonuses[0].isChoose = true;
            this.eventService.emit({
                name: BonusItemComponentEvents.reg,
                data: this.bonuses[0],
            });
            this.configService.set<ChosenBonusType>({
                name: ChosenBonusSetParams.ChosenBonus,
                value: this.bonuses[0],
            });
            this.cdr.markForCheck();
        }
    }

    protected unchooseBonuses(): void {
        _each(this.bonuses, (bonus) => {
            bonus.isChoose = false;
        });

        this.cdr.markForCheck();
    }
}
