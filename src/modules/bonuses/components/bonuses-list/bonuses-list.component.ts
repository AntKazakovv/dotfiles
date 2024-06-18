import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UntypedFormControl} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {UIRouter} from '@uirouter/core';

import Swiper from 'swiper';
import {SwiperOptions} from 'swiper/types/swiper-options';
import {NavigationOptions} from 'swiper/types/modules/navigation';
import _find from 'lodash-es/find';
import _findIndex from 'lodash-es/findIndex';
import _merge from 'lodash-es/merge';
import _union from 'lodash-es/union';
import _each from 'lodash-es/each';
import _random from 'lodash-es/random';

import {
    AbstractComponent,
    IMixedParams,
    EventService,
    IData,
    ICheckboxCParams,
    IPaginateOutput,
    GlobalHelper,
    ActionService,
    INoContentCParams,
    IIndexing,
    ISlide,
    ISliderCParams,
    SliderComponent,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services/bonuses/bonuses.service';
import {IBonusItemCParams} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.params';
import {BonusItemComponent} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.component';
import {
    RecommendedListEvents,
} from 'wlc-engine/modules/bonuses/components/recommended-bonuses/recommended-bonuses.params';
import {
    BonusesListController,
    IBonusesListController,
} from 'wlc-engine/modules/bonuses/system/classes/bonuses-list.controller';
import {
    BonusesFilterType,
    BonusItemComponentEvents,
    ChosenBonusSetParams,
    ChosenBonusType,
    IBonus,
    RestType,
} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';

import * as Params from './bonuses-list.params';

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
    @HostBinding('class.single-bonus-swiper') isSingleBonus: boolean = false;

    public override $params: Params.IBonusesListCParams;
    public bonuses: Bonus[] = [];
    public paginatedBonuses: Bonus[] = [];
    public isReady: boolean = false;
    public sliderParams: ISliderCParams = {
        swiper: {},
    };
    public navigationId: string = _random(10000000).toString(16);
    public slides: ISlide[] = [];
    public checkBoxParams: ICheckboxCParams = {
        name: 'choose-no-bonus',
        text: gettext('Proceed without welcome bonus'),
        textSide: 'right',
        control: new UntypedFormControl(),
        onChange: (checked: boolean) => {
            checked ? this.chooseBlankBonus() : this.chooseBonusByPosition(this.chosenBonusIndex);
        },
    };
    public noContentParams: INoContentCParams;
    public blankBonus: Bonus;
    public usePagination: boolean;
    public showHeader: boolean;
    public showAllBtn: boolean;

    protected promocode: string = '';
    protected itemsPerPage: number = 0;
    protected chosenBonusIndex: number = 0;
    protected ready$: Subject<boolean> = new Subject();
    protected filter?: BonusesFilterType;
    protected bonusesListController: IBonusesListController;

    constructor(
        @Inject('injectParams') protected params: Params.IBonusesListCParams,
        protected bonusesService: BonusesService,
        protected eventService: EventService,
        protected translateService: TranslateService,
        protected actionService: ActionService,
        protected router: UIRouter,
    ) {
        super(
            <IMixedParams<Params.IBonusesListCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });

        this.bonusesListController = new BonusesListController(
            this.bonusesService,
            this.configService,
        );
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.prepareModifiers();
        this.usePagination = this.$params.common?.pagination?.use;

        this.showHeader = !!this.$params.titleParams || !!this.$params.allBtnParams || this.$params.type === 'swiper';

        this.noContentParams = GlobalHelper.getNoContentParams(
            this.$params,
            this.$class,
            this.configService,
        );
        this.cdr.detectChanges();

        if (this.$params.common?.useBlankBonus && this.$params.common?.blankBonus) {
            this.blankBonus = new Bonus(
                {service: 'BonusesListComponent', method: 'ngOnInit'},
                {
                    ID: this.$params.common.blankBonus.id,
                    Name: this.$params.common.blankBonus.name,
                    Description: this.$params.common.blankBonus.description || '',
                    Terms: '',
                } as IBonus,
                this.configService,
            );

            this.blankBonus.isChoose = true;
        }

        this.subscribeOnReady();

        /**
         * TODO: на рефакторинг: сделать что-то с параметрами слайдера
         * чтобы не приходилось в параметрах отдельных конфигов дублировать без нужды breakpoints
         */
        if (this.$params.type === 'swiper') {
            const navParams: NavigationOptions | {} =
                this.$params.hideNavigation ? {} : {
                    navigation: {
                        nextEl: '.wlc-swiper-button-next-' + this.navigationId,
                        prevEl: '.wlc-swiper-button-prev-' + this.navigationId,
                    },
                };
            this.sliderParams.swiper = _merge(this.$params.common?.swiper, navParams);
        }

        this.setFilters();
        this.subscribeBonuses();
        this.setSubscription();

        if (this.params.theme === 'reg-first' || this.$params.theme === 'partial') {
            this.setRegSubscription();
        }
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        this.unchooseBonuses();
        this.bonusesListController.destroy();
    }

    public get isAuthAndBonusesLength(): boolean {
        return this.configService.get<boolean>('$user.isAuthenticated') && !!this.bonuses.length;
    }

    public get showNavigation(): boolean {
        return this.bonuses.length && !this.isSingleBonus && !this.$params.hideNavigation;
    }

    public get chosenBonus(): Bonus {
        return _find(this.bonuses, ({isChoose}) => isChoose);
    }

    protected get selectFirstBonus(): boolean {
        return this.$params?.common.selectFirstBonus;
    }

    public chooseBlankBonus(): void {
        this.unchooseBonuses();
        setTimeout(() => {
            const isChosenBonus = _find(this.bonuses, ({isChoose}) => isChoose);

            _each(this.bonuses, bonus => {
                if (!isChosenBonus && !bonus.id) {
                    bonus.isChoose = true;
                }
            });
            this.checkBoxParams.control.setValue(true);
            this.cdr.detectChanges();
        }, 0);

        this.configService.set<ChosenBonusType>({
            name: ChosenBonusSetParams.ChosenBonus,
            value: {id: null},
        });

        this.eventService.emit({name: BonusItemComponentEvents.blank});
    }

    /**
     * Calculate inline params to bonus-item component
     *
     * @method calcBonusItemParams
     * @param {Bonus} bonus
     * @returns {IBonusItemCParams} inline params to bonus-item component
     */
    public calcBonusItemParams(bonus?: Bonus): IBonusItemCParams {
        return _merge(
            {
                bonus: bonus,
                theme: this.$params.theme,
                themeMod: this.$params.themeMod,
                dummy: !bonus,
            },
            this.$params.itemsParams || {},
        );
    }

    public onSlideChange(swiper: Swiper): void {
        if (swiper.params.slidesPerView === 1 || swiper.params.slidesPerView === 'auto') {
            this.chooseBonusByPosition(swiper.realIndex);
        }
    }

    /**
     * Method updates the data when there was a change in `wlc-pagination` component
     *
     * @method paginationOnChange
     * @param {IPaginateOutput} value - $event output from `wlc-pagination` component
     */
    public paginationOnChange(value: IPaginateOutput): void {
        this.paginatedBonuses = value.paginatedItems as Bonus[];
        this.itemsPerPage = value.event.itemsPerPage;
        this.cdr.detectChanges();
    }

    protected setSubscription(): void {

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

    protected setRegSubscription(): void {
        this.eventService.subscribe([
            {name: BonusItemComponentEvents.reg},
        ], (bonus: Bonus): void => {

            this.unchooseBonuses();
            bonus.isChoose = true;

            if (this.blankBonus && this.blankBonus.id !== bonus.id) {
                this.blankBonus.isChoose = false;
            }

            this.chosenBonusIndex = _findIndex(this.bonuses,
                (item: Bonus) => item.id === bonus.id,
            );

            if (this.checkBoxParams.control.touched || this.checkBoxParams.control.value === true) {
                this.checkBoxParams.control.setValue(false);
            }

            const allowedBonus: boolean = !!_find(this.bonuses, ({id}: Bonus) => id === bonus.id);

            if (!allowedBonus && this.selectFirstBonus) {
                return this.chooseBonusByPosition(0);
            } else if (!allowedBonus && !this.selectFirstBonus) {
                return this.chooseBlankBonus();
            }
            this.configService.set<ChosenBonusType>({
                name: ChosenBonusSetParams.ChosenBonus,
                value: bonus,
            });
            this.cdr.detectChanges();
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

            this.cdr.detectChanges();
        }, this.$destroy);
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params.common?.customModifiers) {
            modifiers = _union(modifiers, this.$params.common.customModifiers.split(' '));
        }
        if (this.configService.get<string>('$base.profile.type') === 'first') {
            modifiers.push('profile-type-first');
        }
        this.addModifiers(modifiers);

        if (this.$params.placement) {
            this.addModifiers(this.$params.placement);
        }
    }

    protected bonusesToSlides(bonuses: Bonus[], scroll?: boolean): void {
        const themeMod = this.configService
            ?.get<IIndexing<unknown>>('$modules.bonuses.components.wlc-bonus-item')?.themeMod;
        this.slides = bonuses?.map((item: Bonus) => {
            return {
                component: BonusItemComponent,
                componentParams: _merge(
                    {
                        theme: this.$params.theme,
                        themeMod: this.$params.themeMod === 'with-ears' && themeMod ? themeMod
                            : this.$params.themeMod,
                        type: this.$params.common.filter,
                        bonus: item,
                    },
                    this.$params.itemsParams || {},
                ),
            };
        });
        if (this.slider?.swiper && scroll) {
            this.slider.swiper.slideTo(0);
        }
        this.cdr.detectChanges();
    }

    protected prepareBonuses(): void {

        if (this.$params.common?.restType === 'active') {
            this.eventService.emit({
                name: RecommendedListEvents.RecommendedListVisibility,
                data: this.bonuses.length,
            });
        }

        this.cdr.detectChanges();
    }

    protected chooseBonusByPosition(pos: number): void {
        if (this.bonuses.length) {
            this.bonuses[pos].isChoose = true;

            this.eventService.emit({
                name: BonusItemComponentEvents.reg,
                data: this.bonuses[pos],
            });
            this.configService.set<ChosenBonusType>({
                name: ChosenBonusSetParams.ChosenBonus,
                value: this.bonuses[pos],
            });
            this.cdr.detectChanges();
        }
    }

    protected unchooseBonuses(): void {
        _each(this.bonuses, (bonus) => {
            bonus.isChoose = false;
        });

        this.cdr.detectChanges();
    }


    protected onGetBonuses(bonuses: Bonus[]): void {
        this.paginatedBonuses = this.bonuses = bonuses;
        this.showAllBtn = !!this.$params.allBtnParams && !!this.bonuses.length;
        const chosenBonus = this.configService.get<ChosenBonusType>(ChosenBonusSetParams.ChosenBonus);

        if (chosenBonus?.id) {
            const chosenBonusIndex = _findIndex(this.bonuses,
                (item: Bonus) => item.id === chosenBonus.id,
            );
            if (chosenBonusIndex !== -1) {
                this.bonuses[chosenBonusIndex].isChoose = true;

                if (this.$params.type === 'swiper') {
                    setTimeout(() => {
                        this.slider?.swiper.slideTo(
                            chosenBonusIndex,
                            this.$params.common.swiperManualTransitionDuration,
                        );
                    });
                }
            }
        } else if (!this.selectFirstBonus && chosenBonus?.id === null) {
            this.chooseBlankBonus();
        } else if (this.selectFirstBonus && !this.chosenBonus) {
            this.chooseBonusByPosition(0);
        } else if (this.$params.theme === 'reg-first') {
            this.chooseBlankBonus();
        }

        if (this.blankBonus) {
            this.blankBonus.isChoose = !this.chosenBonus;
            this.bonuses.push(this.blankBonus);
        }

        this.prepareBonuses();

        if (this.$params.type === 'swiper' && this.bonuses.length) {
            this.bonusesToSlides(this.bonuses);

            if (!this.configService.get<boolean>('$user.isAuthenticated')) {
                if (this.bonuses.length <= 1) {
                    this.sliderParams.swiper = _merge<SwiperOptions, SwiperOptions>({}, {
                        navigation: false,
                        slidesPerView: 1,
                        spaceBetween: 0,
                        allowTouchMove: false,
                        breakpoints: null,
                    });
                    this.isSingleBonus = true;
                } else {
                    this.sliderParams.swiper = _merge({
                        slidesPerView: 1,
                        spaceBetween: 0,
                        allowTouchMove: true,
                    }, this.$params.common.swiper);
                    this.isSingleBonus = false;
                }
            }

            const placement: Params.TBonusesListPlacement = this.$params.placement;
            const disableSwiper: boolean = this.slides.length === 1 && (
                this.params.theme === 'wolf'
                || placement === 'profile-dashboard'
                || placement === 'profile-recommended'
            );

            if (disableSwiper) {
                this.$params = _merge(this.$params, {
                    themeMod: 'default',
                    type: 'default',
                    common: {
                        ...this.$params.common,
                        swiper: null,
                    }});
                this.sliderParams = null;
                this.setModifiers(this.$params.placement);
            }

            this.addModifiers(`count-${bonuses.length}-bonus`);
        }

        this.cdr.detectChanges();
    }

    protected setCheckboxValue(value: boolean): void {
        if (value !== this.checkBoxParams.control.value) {
            this.checkBoxParams.control.patchValue(value, {
                emitEvent: true,
                emitViewToModelChange: true,
            });

            if (!value && this.checkBoxParams.control.disabled) {
                this.checkBoxParams.control.enable();
            } else if (value) {
                this.checkBoxParams.control.disable();
            }
        }
    }

    public scrollTo(selector: string): void {
        const elem: HTMLElement = document.querySelector(selector);
        this.actionService.scrollTo(elem);
    }

    public bonusBg(block: string): string {
        let imageUrl: string;
        const defaultImg = this.configService.get<string>('$bonuses.defaultImages.imageProfileFirst');

        if (block === 'noActive') {
            imageUrl = this.$params.common.noActiveImgPath || defaultImg;
        } else if (block === 'noOffers') {
            imageUrl = this.$params.common.noOffersImgPath || defaultImg;
        }
        return imageUrl ? `url(${imageUrl})` : '';
    }

    public goTo(path: string): void {
        this.router.stateService.go(path);
    }

    /**
     * Set bonuses filter from params or by condition and subscribe to bonuses observer
     */
    private subscribeBonuses(): void {
        this.isReady = false;
        this.ready$.next(false);

        const restType: RestType = this.$params.common?.restType;
        const hasFilteredBonuses: boolean = this.bonusesService.hasFilteredBonuses(this.filter, restType);

        this.bonusesListController.getBonuses({
            subscribeParams: {
                useQuery: this.$params.common?.useQuery || !hasFilteredBonuses,
                type: restType,
                queryFilters: this.$params.common.queryFilters,
            },
            filter: this.filter,
            sort: this.$params.common?.sortOrder,
            filterByGroup: this.$params.common?.filterByGroup,
        });

        this.bonusesListController.ready$
            .pipe(takeUntil(this.$destroy))
            .subscribe((ready: boolean): void => {
                this.ready$.next(ready);
                this.isReady = ready;
            });

        this.bonusesListController.bonuses$.pipe(
            takeUntil(this.$destroy),
        ).subscribe((bonuses: Bonus[]): void => {
            this.onGetBonuses(bonuses);

            if (hasFilteredBonuses) {
                this.ready$.next(true);
                this.isReady = true;
            }
        });
    }

    private setFilters(): void {
        this.filter = this.$params.common?.filter;

        if (this.filter === 'main') {
            if (this.configService.get<boolean>('$bonuses.unitedPageBonuses')) {
                this.filter = 'united';
            } else if (this.configService.get<boolean>('$bonuses.showAllInProfile')) {
                this.filter = 'all';
            }
        }
    }

    /**
     * Handle bonuses list is ready or not,
     * if theme is 'reg-first' or 'partial' set config and emit event if bonus list is empty for registration form
     */
    private subscribeOnReady(): void {
        this.ready$.pipe(takeUntil(this.$destroy)).subscribe((isReady: boolean) => {
            if (this.params.theme === 'reg-first' || this.$params.theme === 'partial') {
                const minLength = this.$params.common?.useBlankBonus ? 1 : 0;
                if (isReady) {
                    const isEmptyRegBonuses = this.bonuses.length <= minLength;
                    this.configService.set<boolean>({name: 'EMPTY_REGISTER_BONUSES', value: isEmptyRegBonuses});
                    this.eventService.emit({name: 'EMPTY_REGISTER_BONUSES', data: isEmptyRegBonuses});

                    if (this.$params.theme === 'reg-first') {
                        if (!this.bonuses.length) {
                            this.setCheckboxValue(true);
                        } else if (this.checkBoxParams.control.value) {
                            this.setCheckboxValue(false);
                        }
                    }
                }
            }

            this.isReady = isReady;
            this.cdr.markForCheck();
        });
    }
}
