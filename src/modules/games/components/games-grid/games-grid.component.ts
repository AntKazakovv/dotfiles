import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild,
} from '@angular/core';
import {ResizedEvent} from 'angular-resize-event';
import {UIRouter} from '@uirouter/core';

import {
    fromEvent,
    merge,
    Subject,
} from 'rxjs';
import {
    filter,
    first,
    takeUntil,
    tap,
    throttleTime,
} from 'rxjs/operators';
import _reduce from 'lodash-es/reduce';
import _keys from 'lodash-es/keys';
import _isUndefined from 'lodash-es/isUndefined';
import _includes from 'lodash-es/includes';
import _times from 'lodash-es/times';
import _map from 'lodash-es/map';
import _size from 'lodash-es/size';
import _slice from 'lodash-es/slice';
import _cloneDeep from 'lodash-es/cloneDeep';
import _orderBy from 'lodash-es/orderBy';
import _isNaN from 'lodash-es/isNaN';
import _isNumber from 'lodash-es/isNumber';
import _merge from 'lodash-es/merge';
import _floor from 'lodash-es/floor';
import _filter from 'lodash-es/filter';
import _findLastIndex from 'lodash-es/findLastIndex';
import _every from 'lodash-es/every';
import _each from 'lodash-es/each';
import _round from 'lodash-es/round';
import _isInteger from 'lodash-es/isInteger';
import _ceil from 'lodash-es/ceil';
import _random from 'lodash-es/random';
import _set from 'lodash-es/set';
import _differenceBy from 'lodash/differenceBy';
import {SwiperOptions} from 'swiper';

import {
    AbstractComponent,
    ConfigService,
    DeviceType,
    ActionService,
    EventService,
    ItemAppearanceAnimation,
    CardLoadingAnimation,
    GlobalHelper,
    IWrapperCParams,
    IFormWrapperCParams,
} from 'wlc-engine/modules/core';
import {
    ISlide,
    ISliderCParams,
} from 'wlc-engine/modules/promo';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {IGamesFilterData} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';
import {gamesEvents} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {GamesFilterServiceEvents} from 'wlc-engine/modules/games/system/services/games-filter.service';
import {GameThumbComponent} from 'wlc-engine/modules/games/components/game-thumb/game-thumb.component';
import {GamesFilterService} from 'wlc-engine/modules/games/system/services/games-filter.service';
import {IGameThumbCParams} from 'wlc-engine/modules/games/components/game-thumb/game-thumb.params';

import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';

import * as Params from './games-grid.params';

@Component({
    selector: '[wlc-games-grid]',
    templateUrl: './games-grid.component.html',
    styleUrls: ['./styles/games-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        ...ItemAppearanceAnimation,
        ...CardLoadingAnimation,
    ],
})
export class GamesGridComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Params.IGamesGridCParams;
    @Input() protected set gamesList(games: Game[]) {
        this._gamesList = games;
        this.prepareGrid();
    };
    @Input() protected $swiperProgress: Subject<number>;

    @ViewChild('gameList') protected gameListElement: ElementRef;
    @ViewChild('gameItem') protected gameItem: ElementRef;
    @ViewChild('gameBanner') protected gameBanner: ElementRef;

    public $params: Params.IGamesGridCParams;
    public isReady: boolean = false;
    public games: Game[] = [];
    public gamesCount: number = 1;

    public title: string;
    public placeHolders: number[] = _times(6, Number);
    public hideShowMoreBtn: boolean = false;
    public isDesktop: boolean;
    public hideEmptyComponent: boolean = false;
    public useLazy: boolean = false;
    public lazyLoading: boolean = false;
    public moreBtnCardView: boolean;
    public gameSlides: ISlide[] = [];
    public placeHoldersSlides: ISlide[] = [];
    public noContentText: string = gettext('No games available');
    // We have to calculate the ID here, because if we calculate it in the prepareGrid,
    // the swiper navigation buttons will lose their binding
    public navigationId: string = _random(10000000).toString(16);

    public gamesSliderConfig: IWrapperCParams = {components: []};
    public gamePlaceholdersSliderConfig: IWrapperCParams = {components: []};
    public bannerSliderConfig: IWrapperCParams = {components: []};

    protected gamesRows: number = 1;
    protected gamesRowsLoaded: number = 0;
    protected paginate: number;
    protected filterChangedCounter: number = 0;
    protected lazyTimeout: number;
    protected categoryTitle: string;
    protected filterName: string;
    protected deviceType: DeviceType;
    protected lastPlayedLoaded: boolean = false;
    protected favoritesLoaded: boolean = false;
    protected jackpotsLoaded: boolean = false;
    protected isClickedLoadMoreBtn: boolean = false;
    protected useLazyAfterClick: boolean = false;
    protected $isReady: Subject<void> = new Subject<void>();

    private _gamesList: Game[];
    private $untilBreakpointOrDestroy: Subject<void> = new Subject();

    constructor(
        @Inject('injectParams') protected injectParams: Params.IGamesGridCParams,
        protected gamesCatalogService: GamesCatalogService,
        protected eventService: EventService,
        protected actionService: ActionService,
        protected configService: ConfigService,
        protected router: UIRouter,
        protected cdr: ChangeDetectorRef,
        protected renderer: Renderer2,
        protected elementRef: ElementRef,
        @Inject(WINDOW) protected window: Window,
        protected gamesFilterService: GamesFilterService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
        this.trackGames = this.trackGames.bind(this);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.$params.wlcElement ??= `wlc-games-grid-${this.getWlcSuffix()}`;

        this.setWlcElementOnHost();
        this.initTitleIcon();

        if (this.$params.theme !== 'swiper' && this.$params.theme !== 'mobile-app-swiper') {
            this.applyMoreBtnSettings();
        }

        this.filterName = this.$params.searchFilterName;

        this.$isReady
            .pipe(
                first(() => this.isReadyOrUsePlaceholder),
                takeUntil(this.$destroy),
            )
            .subscribe(() => this.loadSlidersComponentsOnReady());
        this.initEventListeners();

        if (_size(this.$params.breakpoints)) {
            this.followBreakpoints();
        }

        this.prepareThumbParams();
        this.prepareGrid().finally();
        this.setNoContentText();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();

        this.$untilBreakpointOrDestroy.next();
        this.$untilBreakpointOrDestroy.complete();
    }

    /**
     * return true if visible games is less than games length
     * and if cardView params setted to false
     * and if useLazy is setted to false or useLazy setted to true and buton was clicked
     * @returns boolean
     */
    public get moreBlockDisplayCondition(): boolean {
        return !this.moreBtnCardView && this.gamesCount < this.games.length && this.lazyWithClick;
    }

    /**
     * return true if hide param in button is false
     * and showAllLink.use is setted to false
     * and if useLazy is setted to false or useLazy setted to true and buton was clicked
     * @returns boolean
     */
    public get loadMoreDisplayCondition(): boolean {
        return !this.hideShowMoreBtn && !this.$params.showAllLink?.use && this.lazyWithClick;
    }

    public get showDefaultHeader(): boolean {
        return (this.$params.showTitle || this.$params.showAllLink?.use) && this.$params.themeMod !== 'header-inline';
    }

    /**
     * return current animation state, when useLoadingAnimation param is true or empty string otherwise
     * @returns number | string
     */
    public get isLoadingAnimation(): number | string {
        return this.$params.useLoadingAnimation ? this.filterChangedCounter + this.gamesRowsLoaded : '';
    }

    public get isReadyOrUsePlaceholder(): boolean {
        return this.$params.usePlaceholders || this.isReady;
    }

    public get showGameSlides(): boolean {
        return this.games.length && this.isReady;
    }

    public get hasGames(): boolean {
        const shouldUsePlaceholder = this.$params.usePlaceholders && !this.isReady;
        return !!this.games.length || shouldUsePlaceholder;
    }

    /**
     * Whether to show the Preloader
     * @return boolean
    */
    public get isShowPreloader(): boolean {
        return this.games?.length > this.gamesCount;
    }

    public trackGames(index: number, item: Game): string {
        return `${this.filterChangedCounter}.${item.ID}`;
    }

    /**
     * Resize container handler
     */
    public onResize(event: ResizedEvent): void {
        if (!event.oldRect?.width || Math.abs(event.oldRect.width - event.newRect.width) > 20) {
            this.setGridParams();
        }
    }

    /**
     * Load more button handler
     */
    public loadMore(): void {
        this.isClickedLoadMoreBtn = true;
        this.loadMoreGames();

        if (this.useLazyAfterClick && this.lazyLoadPositionFilter()) {
            this.setLazyLoadingTrue();
            this.loadMoreGames();
        }
    }

    public get showBottomLink(): boolean {
        return this.$params.showAllLink?.use &&
            this.$params.showAllLink?.position === 'bottom' &&
            !this.$params.showAllLink.titleLinkOnly;
    }

    public get showTopLink(): boolean {
        return this.$params.showAllLink?.use &&
            this.$params.showAllLink?.position === 'top' &&
            !this.$params.showAllLink.titleLinkOnly;
    }

    public get showDesktopLink(): boolean {
        return this.$params.showAllLink?.use && this.isDesktop && !this.$params.showAllLink.titleLinkOnly;
    }

    protected get lazyWithClick(): boolean {
        return !this.useLazy || (this.useLazyAfterClick && !this.isClickedLoadMoreBtn);
    }

    protected loadMoreGames(): void {
        if (this.gamesCount === this.games?.length) {
            return;
        }

        this.gamesRowsLoaded += this.$params.gamesRows;

        this.setGridParams();

        if (this.$params.moreBtn?.scrollToEnd && !this.useLazy) {
            setTimeout(() => {
                this.actionService.scrollTo(this.elementRef.nativeElement, {
                    position: 'end',
                    offsetY: 40,
                });
            }, 750);
        }

        this.lazyLoading = false;
        this.cdr.detectChanges();
    }

    /**
    * Set no content text by suffix
    */
    protected setNoContentText(): void {
        this.noContentText = this.$params.noContentText?.[this.getWlcSuffix()]
            || this.$params.noContentText?.default || gettext('No games available');
    }

    protected prepareThumbParams(): void {

        if (this.configService.get<boolean>('$base.games.jackpots.useRealJackpots')) {
            _set(this.$params, 'thumbParams.showJackpotAmount', true);
        }
        this.$params.thumbParams = _cloneDeep(this.$params.thumbParams);
    }

    protected async prepareGrid(): Promise<void> {
        this.isReady = false;
        this.gamesRowsLoaded = 0;
        this.games = await this.getGames();
        this.title = this.$params.title || this.gamesCatalogService.getGamesTitleByState() || this.categoryTitle;

        if (this.$params.theme === 'swiper' || this.$params.theme === 'mobile-app-swiper') {
            // if we use a class field to this.$params.showAsSwiper.sliderParams.swiper.navigation,
            // the swiper navigation buttons will lose their binding
            if (this.$params.showAsSwiper?.useNavigation) {
                this.$params.showAsSwiper.sliderParams.swiper.navigation = {
                    prevEl: '.wlc-swiper-button-prev-' + this.navigationId,
                    nextEl: '.wlc-swiper-button-next-' + this.navigationId,
                };
            }

            if (this.$params.showAsSwiper.maxSlidesCount) {
                this.games = _slice(this.games, 0, this.$params.showAsSwiper.maxSlidesCount);
            }

            this.gameSlides = this.games.map((game: Game) => {
                return {
                    component: GameThumbComponent,
                    componentParams: _merge(
                        <IGameThumbCParams>{
                            common: {
                                game,
                            },
                        },
                        this.$params.thumbParams,
                    ),
                };
            });

            this.gamesSliderConfig = this.createConfigSliders(this.gameSlides);

            // without that code we have problems with margins if the number of games is less than or
            // equal to the number that fits in the swiper. Screenshot:
            // https://tracker.egamings.com/attachments/827987
            _each(
                this.$params.showAsSwiper?.sliderParams?.swiper?.breakpoints,
                (breakpoint: SwiperOptions) => {
                    if (
                        breakpoint.grid?.rows > 1
                        && !_isInteger(+breakpoint.slidesPerView)
                        && this.games.length < +breakpoint.slidesPerView * breakpoint.grid?.rows
                    ) {
                        breakpoint.slidesPerView = _round(+breakpoint.slidesPerView);
                    }
                });
        }

        if (this.router.globals.transitionHistory.peekTail().$from().name) {
            setTimeout(() => {
                this.setReadyFlags();
            });
        } else {
            this.setReadyFlags();
        }
    }

    protected setReadyFlags(): void {
        this.isReady = true;
        this.$isReady.next();
        if (!this.games.length && this.$params.hideEmpty) {
            this.hideEmptyComponent = true;
        }
        this.cdr.markForCheck();
    }

    protected initEventListeners(): void {
        if (this.$params.theme !== 'swiper' && this.$params.theme !== 'mobile-app-swiper') {
            this.actionService.deviceType()
                .pipe(takeUntil(this.$destroy))
                .subscribe((type: DeviceType) => {
                    this.handleDeviceTypeChange(type);
                });
        }

        this.eventService.subscribe([
            {name: gamesEvents.FETCH_GAME_CATALOG_SUCCEEDED},
            {name: gamesEvents.UPDATED_AVAILABLE_GAMES},
        ], (): void => {
            this.prepareGrid().finally(() => {
                this.setGridParams();
            });
        }, this.$destroy);

        if (this.$params.byState) {
            const successTransitionListener = this.router.transitionService.onSuccess({}, () => {
                this.$params.wlcElement = `wlc-games-grid-${this.getWlcSuffix()}`;
                this.setWlcElementOnHost();
                this.setNoContentText();
                this.prepareGrid().finally(() => {
                    this.setGridParams();
                });

                if (this.useLazyAfterClick) {
                    this.isClickedLoadMoreBtn = false;
                }
            });

            this.$destroy.subscribe(() => {
                successTransitionListener();
            });
        }

        if (this.$params.type === 'search') {
            this.eventService.subscribe([
                {
                    name: GamesFilterServiceEvents.FILTER_CHANGED,
                    from: this.filterName,
                },
                {
                    name: GamesFilterServiceEvents.FILTER_SEARCH,
                    from: this.filterName,
                },
            ], (filter: IGamesFilterData) => {
                this.onFilterChanged(filter);
            }, this.$destroy);
            this.gamesFilterService.$gamesFilterSubsIsReady.next();
        }

        this.initLazyLoading();
    }

    protected lazyLoadPositionFilter(): boolean {
        const currentPosition = this.window.scrollY + this.window.window.innerHeight;
        const elemClientRect = this.elementRef.nativeElement.getBoundingClientRect();
        const elemBottom = (elemClientRect.top + this.window.scrollY + elemClientRect.height);
        const conditional = (currentPosition > elemBottom && this.gamesCount < this.games.length);

        return this.useLazyAfterClick ? (conditional && this.isClickedLoadMoreBtn) : conditional;
    }

    protected setLazyLoadingTrue(): void {
        if (!this.lazyLoading) {
            this.lazyLoading = true;
            this.cdr.markForCheck();
        }
    }

    protected handleDeviceTypeChange(type: DeviceType): void {
        this.deviceType = type;
        this.isDesktop = this.deviceType === DeviceType.Desktop;
        this.applyMobileSettings();
        this.applyTabletSettings();
        this.cdr.markForCheck();
    }

    /**
     * Set grid params
     */
    protected setGridParams(): void {
        if (this.$params.theme === 'swiper' || this.$params.theme === 'mobile-app-swiper') {
            const breakpoints = _orderBy(
                _map(
                    _keys(this.$params.showAsSwiper?.sliderParams?.swiper?.breakpoints),
                    (val: string) => _isNaN(+val) ? val : +val),
            );
            const mqList: MediaQueryList[] = _map(
                breakpoints,
                (value: number) => this.window.matchMedia(`(min-width: ${value}px)`),
            );
            const active = breakpoints[_findLastIndex(mqList, (item) => item.matches)];
            const breakpoint = this.$params.showAsSwiper?.sliderParams?.swiper?.breakpoints[active];

            this.gamesCount = _ceil(+breakpoint.slidesPerView) * (breakpoint.grid?.rows || 1);
        } else {
            this.moreButtonChangeState(false);
            this.resetGamesRows();
            const itemWidth = this.gameItem?.nativeElement.getBoundingClientRect().width;
            const itemHeight = this.gameItem?.nativeElement.getBoundingClientRect().height;
            const bannerWidth = this.gameBanner?.nativeElement.getBoundingClientRect().width || 0;
            const bannerHeight = this.gameBanner?.nativeElement.getBoundingClientRect().height || 0;
            const listWidth = this.gameListElement?.nativeElement.getBoundingClientRect().width;

            const prevPlaceHoldersCount = _floor(listWidth / itemWidth) || 1;
            this.gamesRows += this.gamesRowsLoaded;
            this.paginate = prevPlaceHoldersCount * this.gamesRows;

            this.gamesCount = this.paginate;

            if (this.moreBtnCardView && this.games.length > this.gamesCount) {
                this.gamesCount--;
            }

            if (this.$params.themeMod === 'header-inline') {
                this.gamesCount--;
            }

            if (this.$params.bannerSettings && (bannerWidth < listWidth)) {
                this.gamesCount -= (_floor(bannerWidth / itemWidth) + _floor(bannerHeight / itemHeight));
            }

            this.checkGamesLength();
        }

        this.setPlaceHolders();
        this.cdr.markForCheck();
    }

    protected checkGamesLength(): void {
        if (this.games.length && this.gamesCount >= this.games.length) {
            this.moreButtonChangeState(true);
            this.gamesCount = this.games.length;
        }
    }

    protected setPlaceHolders(): void {

        if (this.$params.usePlaceholders &&
            this.$params.theme === 'swiper' || this.$params.theme === 'mobile-app-swiper') {
            this.placeHoldersSlides = _times(this.gamesCount, Number).map(() => {
                return {
                    component: GameThumbComponent,
                    componentParams: {
                        common: {
                            dumpy: true,
                        },
                    },
                };
            });
        }
        this.placeHolders = _times(this.gamesCount, Number);
    }

    /**
     * Get games
     *
     * @returns {Promise<Game[]>}
     */
    protected async getGames(): Promise<Game[]> {
        await this.gamesCatalogService.ready;
        return await this.getFilteredGames();
    }

    /**
     * Get filtered games
     *
     * @returns {Game[]}
     */
    protected async getFilteredGames(): Promise<Game[]> {
        if (this.$params.gamesList) {
            return this.gamesCatalogService.filterAvailableGames(this.$params.gamesList);
        } else if (this._gamesList) {
            return this.gamesCatalogService.filterAvailableGames(this._gamesList);
        } else if (this.$params.tournamentGamesFilter || this.$params.tournamentFreeRoundGames) {
            return this.getTournamentGames();
        } else if (this.$params.byState) {
            return await this.getGamesByState();
        } else if (this.$params.filter) {
            return await this.getGamesByFilter();
        } else {
            return this.getAllGames();
        }
    }

    /**
     * Get tournament games
     *
     * @returns {Game[]} Games list
     */
    protected getTournamentGames(): Game[] {
        if (this.$params.tournamentFreeRoundGames) {
            return this.gamesCatalogService.getGamesByFreeRounds(this.$params.tournamentFreeRoundGames);
        } else if (this.$params.tournamentGamesFilter) {
            return this.gamesCatalogService.getTournamentGames(this.$params.tournamentGamesFilter);
        }
    }

    protected async getGamesByState(): Promise<Game[]> {
        return await this.gamesCatalogService.getGamesByState();
    }

    protected async getGamesByFilter(): Promise<Game[]> {
        const filter: IGamesFilterData = {
            categories: this.$params.filter['categories'] || [this.$params.filter['category']] || [],
            merchants: this.$params.filter['merchants'] || [],
            excludeCategories: this.$params.filter['excludeCategories'] || [],
            excludeMerchants: this.$params.filter['excludeMerchants'] || [],
            ids: this.$params.filter['ids'],
            searchQuery: this.$params.filter['searchQuery'],
        };

        const cat = this.$params.filter['categories']?.[0] || this.$params.filter['category'] || '';
        await this.preloadSpecialGames(filter);

        const category = this.gamesCatalogService.getCategoryBySlug(cat);
        if (category) {
            const currentLang = this.router.stateService.params?.locale || 'en';
            this.categoryTitle = category.title[currentLang] || category.title['en'];
        }
        return this.gamesCatalogService.getGameList(filter);
    }

    protected getAllGames(): Game[] {
        return this.gamesCatalogService.getGameList();
    }

    /**
     * Preload special games (favorites, last played)
     *
     * @param {IGamesFilterData} filter
     * @returns {Promise<void>}
     */
    protected async preloadSpecialGames(filter?: IGamesFilterData): Promise<void> {
        if (!this.favoritesLoaded && _includes(filter?.categories, 'favourites')) {
            await this.gamesCatalogService.getFavouriteGames();
            this.favoritesLoaded = true;
        }

        if (!this.lastPlayedLoaded && _includes(filter?.categories, 'lastplayed')) {
            await this.gamesCatalogService.getLastGames();
            this.lastPlayedLoaded = true;
        }

        if (!this.jackpotsLoaded && _includes(filter?.categories, 'jackpots')) {
            const category = this.gamesCatalogService.getCategoryBySlug('jackpots');
            if (category) {
                await category.isReady;
            }
            this.jackpotsLoaded = true;
        }
    }

    /**
     * Handler for filter change
     *
     * @param {IGamesFilterData} filter
     * @returns {Promise<void>}
     */
    protected async onFilterChanged(filter: IGamesFilterData): Promise<void> {
        this.isReady = false;
        this.cdr.markForCheck();
        const oldGames = this.games;
        await this.preloadSpecialGames(filter);
        this.games = this.gamesCatalogService.getGameList(filter);

        if (oldGames.length !== this.games.length || _differenceBy(oldGames, this.games, 'ID').length) {
            this.filterChangedCounter++;
        }

        if (this.$params.updateGridAfterFiltering) {
            this.gamesCount = this.$params.gamesRows;
            this.gamesRowsLoaded = 0;
        } else if (this.paginate) {
            this.gamesCount = this.paginate;
        }

        this.moreButtonChangeState();

        this.isReady = true;
        this.$isReady.next();

        this.cdr.markForCheck();
    }

    protected moreButtonChangeState(state?: boolean): void {
        if (this.$params.moreBtn?.hide) {
            this.hideShowMoreBtn = true;
            return;
        }

        if (!_isUndefined(state)) {
            this.hideShowMoreBtn = state;
            return;
        }

        this.hideShowMoreBtn = this.games.length < this.paginate;
    }

    /** @deprecated delete after change settings type in the projects */
    protected applyMobileSettings(): void {
        if (this.deviceType === DeviceType.Mobile && this.$params.mobileSettings?.showLoadButton) {
            this.$params.moreBtn.hide = false;
        }
    }

    /** @deprecated delete after change settings type in the projects */
    protected applyTabletSettings(): void {
        if (this.deviceType === DeviceType.Tablet && this.$params.tabletSettings?.showLoadButton) {
            this.$params.moreBtn.hide = false;
        }
    }

    protected getWlcSuffix(): string {
        if (this.$params.filter) {
            return _reduce(_keys(this.$params.filter).sort(), (res, item) => {
                res.push(item + '-' + this.$params.filter[item]);
                return res;
            }, []).join('-');

        } else if (this.$params.byState) {
            const suffixByState: string = this.gamesCatalogService.getChildCategoryByState()?.slug
                || this.gamesCatalogService.getParentCategoryByState()?.slug;
            return suffixByState === 'casino' ? 'all-games' : suffixByState;

        } else {
            return 'all-games';
        }
    }

    protected resetGamesRows(): void {
        this.gamesRows = this.$params.gamesRows;

        if (this.$params.mobileSettings || this.$params.tabletSettings) {
            switch (this.deviceType) {
                case 'mobile':
                    this.gamesRows = this.$params.mobileSettings?.gamesRows || this.$params.gamesRows;
                    break;
                case 'tablet':
                    this.gamesRows = this.$params.tabletSettings?.gamesRows || this.$params.gamesRows;
                    break;
                default:
                    this.gamesRows = this.$params.gamesRows;
                    break;
            }
        }

    }

    protected initTitleIcon(): void {
        if (this.$params.titleIcon?.byCategory) {
            const category: string =
                this.$params.category?.slug ||
                this.$params.filter?.['categories']?.[0] ||
                this.$params.filter?.['category'] ||
                this.gamesCatalogService.getChildCategoryByState()?.slug ||
                this.gamesCatalogService.getParentCategoryByState()?.slug;

            if (category) {
                const folder = this.$params.titleIcon.folder
                    || this.configService.get<string>('$menu.categoryMenu.icons.folder');
                const icon = folder ? `${folder}/${category}` : category;
                this.$params.titleIcon.name = icon.split('.').length > 1 ? icon : `${icon}.svg`;
                this.$params.titleIcon.fallback = `${folder}/plug.svg`;
            }
        }

        if (this.$params.titleIcon?.name) {
            this.addModifiers('title-icon');
        } else {
            this.removeModifiers('title-icon');
        }
    }

    protected followBreakpoints(): void {
        const initiatedParams = _cloneDeep(this.$params);

        let breakpoints = _orderBy(
            _map(_keys(this.$params.breakpoints), (val: string) => _isNaN(+val) ? val : +val),
            'desc',
        );

        if (_every(breakpoints, (el) => _isNaN(+el))) {
            this.applyBreakpointParams(initiatedParams, this.actionService.getDeviceType());

            this.actionService.deviceType()
                .pipe(takeUntil(this.$destroy))
                .subscribe((type: DeviceType) => {
                    this.applyBreakpointParams(initiatedParams, type);
                });
        } else {
            breakpoints = _filter(breakpoints, (val) => _isNumber(val));

            const mqList: MediaQueryList[] = _map(
                breakpoints,
                (value: number) => this.window.matchMedia(`(min-width: ${value}px)`),
            );

            const active = breakpoints[_findLastIndex(mqList, (item) => item.matches)];
            this.applyBreakpointParams(initiatedParams, active);

            merge(..._map(mqList, (el) => GlobalHelper.mediaQueryObserver(el)))
                .pipe(takeUntil(this.$destroy))
                .subscribe(() => {
                    const breakpoint = breakpoints[_findLastIndex(mqList, (item) => item.matches)];
                    this.applyBreakpointParams(initiatedParams, breakpoint);
                });
        }
    }

    protected applyBreakpointParams(initiatedParams: Params.IGamesGridCParams, breakpoint: string | number): void {
        this.$untilBreakpointOrDestroy.next();

        const {breakpoints} = this.$params;

        if (breakpoints[breakpoint]) {
            this.$params = _merge({}, this.$params, breakpoints[breakpoint]);
        } else {
            this.$params = _merge({}, initiatedParams);
        }

        this.applyMoreBtnSettings();
        this.initLazyLoading();

        this.cdr.markForCheck();
    }

    protected loadSlidersComponentsOnReady(): void {
        if (this.isReadyOrUsePlaceholder && this.hasGames) {
            this.initGameSliders();

            if (this.$params.bannerSettings) {
                this.initBannersSlider();
            }
        }
    }

    protected createConfigSliders(slides: ISlide[]): IFormWrapperCParams {
        return {
            components: [
                {
                    name: 'promo.wlc-slider',
                    params: <ISliderCParams>_merge({slides}, this.$params.showAsSwiper?.sliderParams),
                },
            ],
        };
    }

    protected initGameSliders(): void {
        if (this.showGameSlides) {
            this.gamesSliderConfig = this.createConfigSliders(this.gameSlides);
        } else {
            this.gamePlaceholdersSliderConfig = this.createConfigSliders(this.placeHoldersSlides);
        }
    }

    protected initBannersSlider(): void {
        this.bannerSliderConfig = {
            components: [
                {
                    name: 'promo.wlc-banners-slider',
                    params: this.$params.bannerSettings,
                },
            ],
        };
    }

    private applyMoreBtnSettings(): void {
        const settings: Params.IGamesGridMoreBtn = this.$params.moreBtn || {};

        this.useLazy = settings.lazy;
        this.useLazyAfterClick = settings.lazyAfterClick;
        this.moreBtnCardView = settings.cardView;
        this.lazyTimeout = settings.lazyTimeout || 0;

        this.isClickedLoadMoreBtn = false;
    }

    private initLazyLoading(): void {
        if (this.useLazy) {
            if (this.$swiperProgress) {
                this.$swiperProgress
                    .pipe(
                        takeUntil(this.$untilBreakpointOrDestroy),
                        filter((value: number): boolean => value >= 0.98),
                        tap((): void => this.setLazyLoadingTrue()),
                        throttleTime(this.lazyTimeout),
                    )
                    .subscribe((): void => {
                        this.loadMoreGames();
                    });
            } else {
                merge(
                    this.actionService.scrollableElement('appContent'),
                    fromEvent(this.window, 'scroll'),
                ).pipe(
                    filter((): boolean => this.lazyLoadPositionFilter()),
                    tap((): void => this.setLazyLoadingTrue()),
                    throttleTime(this.lazyTimeout),
                    takeUntil(this.$untilBreakpointOrDestroy),
                ).subscribe((): void => {
                    this.loadMoreGames();
                });
            }
        }
    }
}
