import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    Input,
    OnInit,
    Renderer2,
    ViewChild,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';
import {
    fromEvent,
    merge,
} from 'rxjs';
import {
    filter,
    takeUntil,
    tap,
    throttleTime,
} from 'rxjs/operators';
import {ResizedEvent} from 'angular-resize-event';
import {
    AbstractComponent,
    ConfigService,
    DeviceType,
    ActionService,
    EventService,
    ItemAppearanceAnimation,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {
    Game,
    IGamesFilterData,
    gamesEvents,
    GamesFilterServiceEvents,
    GameThumbComponent,
} from 'wlc-engine/modules/games';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {
    ISlide,
} from 'wlc-engine/modules/promo';

import * as Params from './games-grid.params';

import _reduce from 'lodash-es/reduce';
import _keys from 'lodash-es/keys';
import _isUndefined from 'lodash-es/isUndefined';
import _includes from 'lodash-es/includes';
import _times from 'lodash-es/times';
import _map from 'lodash-es/map';
import _size from 'lodash-es/size';
import _cloneDeep from 'lodash-es/cloneDeep';
import _orderBy from 'lodash-es/orderBy';
import _isNaN from 'lodash-es/isNaN';
import _isNumber from 'lodash-es/isNumber';
import _merge from 'lodash-es/merge';
import _floor from 'lodash-es/floor';
import _filter from 'lodash-es/filter';
import _findLastIndex from 'lodash-es/findLastIndex';
import _every from 'lodash-es/every';

@Component({
    selector: '[wlc-games-grid]',
    templateUrl: './games-grid.component.html',
    styleUrls: ['./styles/games-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        ...ItemAppearanceAnimation,
    ],
})
export class GamesGridComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: Params.IGamesGridCParams;
    @Input() protected gamesList: Game[];

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
    public noContentText: string = gettext('No games available');

    protected gamesRows: number = 1;
    protected gamesRowsLoaded: number = 0;
    protected paginate: number;
    protected filterChangedCounter: number = 0;
    protected lazyTimeout: number = 1000;
    protected categoryTitle: string;
    protected filterName: string;
    protected deviceType: DeviceType;
    protected lastPlayedLoaded: boolean = false;
    protected favoritesLoaded: boolean = false;
    protected jackpotsLoaded: boolean = false;

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
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
        this.trackGames = this.trackGames.bind(this);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.$params.wlcElement ??= `wlc-games-grid-${this.getWlcSuffix()}`;
        this.setWlcElementOnHost();
        this.initTitleIcon();

        if (this.$params.moreBtn?.lazy) {
            this.useLazy = this.$params.moreBtn.lazy;
            this.lazyTimeout ??= this.$params.moreBtn?.lazyTimeout;
        }
        this.moreBtnCardView = this.$params.moreBtn?.cardView || false;

        this.filterName = this.$params.searchFilterName || 'page';

        this.initEventListeners();
        if (_size(this.$params.breakpoints)) {
            this.followBreakpoints();
        }
        this.prepareGrid().finally();
        this.setNoContentText();
    }

    public get showDefaultHeader(): boolean {
        return (this.$params.showTitle || this.$params.showAllLink?.use) && this.$params.themeMod !== 'header-inline';
    }

    public trackGames(index: number, item: Game): string {
        return `${this.filterChangedCounter}.${item.ID}`;
    }

    /**
     * Resize container handler
     */
    public onResize(event: ResizedEvent): void {
        if (!event.oldWidth || Math.abs(event.oldWidth - event.newWidth) > 20) {
            this.setGridParams();
        }
    }

    /**
     * Load more button handler
     */
    public loadMore(): void {
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
            }, 500);
        }

        this.lazyLoading = false;
        this.cdr.markForCheck();
    }

    /**
    * Set no content text by suffix
    */
    private setNoContentText(): void {
        this.noContentText = this.$params.noContentText?.[this.getWlcSuffix()]
            || this.$params.noContentText?.default || gettext('No games available');
    }

    protected async prepareGrid(): Promise<void> {
        this.isReady = false;
        this.gamesRowsLoaded = 0;
        this.games = await this.getGames();
        this.title = this.$params.title || this.gamesCatalogService.getGamesTitleByState() || this.categoryTitle;
        if (this.$params.showAsSwiper) {
            this.gameSlides = this.games.map((game: Game) => {
                return {
                    component: GameThumbComponent,
                    componentParams: {
                        common: {
                            game: game,
                        },
                    },
                };
            });
        }
        this.isReady = true;

        if (!this.games.length && this.$params.hideEmpty) {
            this.hideEmptyComponent = true;
        }
        this.cdr.detectChanges();
    }

    protected initEventListeners(): void {
        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                this.handleDeviceTypeChange(type);
            });

        this.eventService.subscribe([
            {name: gamesEvents.FETCH_GAME_CATALOG_SUCCEEDED},
            {name: gamesEvents.UPDATED_AVAILABLE_GAMES},
        ],
        () => {
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
        }

        if (this.useLazy) {
            fromEvent(window, 'scroll')
                .pipe(
                    takeUntil(this.$destroy),
                    filter(() => this.lazyLoadPipeFilter()),
                    tap(() => this.lazyLoadPipeTap()),
                    throttleTime(this.lazyTimeout),
                )
                .subscribe(() => {
                    this.loadMore();
                });
        }
    }

    protected lazyLoadPipeFilter(): boolean {
        const currentPosition = window.scrollY + window.window.innerHeight;
        const elemClientRect = this.elementRef.nativeElement.getBoundingClientRect();
        const elemBottom = (elemClientRect.top + window.scrollY + elemClientRect.height);
        return (currentPosition > elemBottom && this.gamesCount < this.games.length);
    }

    protected lazyLoadPipeTap(): void {
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
        this.moreButtonChangeState(false);
        this.resetGamesRows();
        const itemWidth = this.gameItem?.nativeElement.getBoundingClientRect().width;
        const bannerWidth = this.gameBanner?.nativeElement.getBoundingClientRect().width || 0;
        const listWidth = this.gameListElement?.nativeElement.getBoundingClientRect().width;
        const width = this.$params.bannerSettings ? listWidth - bannerWidth : listWidth;

        const prevPlaceHoldersCount = _floor(width / itemWidth) || 1;
        this.gamesRows += this.gamesRowsLoaded;
        this.paginate = prevPlaceHoldersCount * this.gamesRows;

        this.gamesCount = this.paginate;

        if (this.moreBtnCardView && this.games.length > this.gamesCount) {
            this.gamesCount--;
        }

        if (this.$params.themeMod === 'header-inline') {
            this.gamesCount--;
        }

        if (this.$params.bannerSettings) {
            this.gamesCount += _floor(bannerWidth / itemWidth) * this.gamesRowsLoaded;
        }

        this.checkGamesLength();
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
        if (this.$params.usePlaceholders) {
            this.placeHolders = _times(this.gamesCount, Number);
        }
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
            return this.$params.gamesList;
        } else if (this.gamesList) {
            return this.games;
        } else if (this.$params.tournamentGamesFilter) {
            return this.getTournamentGames();
        } else if (this.$params.byState) {
            return await this.getGamesByState();
        } else if (this.$params.filter) {
            return await this.getGamesByFilter();
        } else {
            return this.getAllGames();
        }
    }

    protected getTournamentGames(): Game[] {
        return this.gamesCatalogService.getTournamentGames(this.$params.tournamentGamesFilter);
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
            searchQuery: this.$params.filter['searchQuery'] || '',
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

        await this.preloadSpecialGames(filter);
        this.games = this.gamesCatalogService.getGameList(filter);
        this.filterChangedCounter++;
        this.gamesCount = this.paginate;
        this.moreButtonChangeState();

        this.isReady = true;
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
                (value: number) => window.matchMedia(`(min-width: ${value}px)`),
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
        const {breakpoints} = this.$params;

        if (breakpoints[breakpoint]) {
            this.$params = _merge({}, this.$params, breakpoints[breakpoint]);
        } else {
            this.$params = _merge({}, initiatedParams);
        }
        this.cdr.markForCheck();
    }
}
