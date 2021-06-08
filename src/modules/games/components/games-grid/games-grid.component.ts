import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Inject,
    Input,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
    UIRouter,
    TransitionService,
} from '@uirouter/core';
import {fromEvent} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ResizedEvent} from 'angular-resize-event';
import {
    AbstractComponent,
    ConfigService,
    ILanguage,
    DeviceType,
    ActionService,
    EventService,
    ItemAppearanceAnimation,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {
    Game,
    CategoryModel,
    IGamesFilterData,
    gamesEvents,
    GamesCatalogService,
    GamesFilterServiceEvents,
} from 'wlc-engine/modules/games';
import * as Params from './games-grid.params';

import _reduce from 'lodash-es/reduce';
import _keys from 'lodash-es/keys';
import _isUndefined from 'lodash-es/isUndefined';
import _each from 'lodash-es/each';
import _includes from 'lodash-es/includes';

@Component({
    selector: '[wlc-games-grid]',
    templateUrl: './games-grid.component.html',
    styleUrls: ['./styles/games-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        ...ItemAppearanceAnimation,
    ],
})
export class GamesGridComponent extends AbstractComponent
    implements OnInit, AfterViewChecked {

    public $params: Params.IGamesGridCParams;
    public isReady: boolean = false;
    public filteredGames: Game[];
    public title: string;
    public gamesCount: number = 1;
    public placeHolders: number[];
    public placeHolderStyles: object = {};
    public hideShowMoreBtn: boolean = false;
    public useLazy: boolean;
    public lazyReady: boolean = true;
    public searchQuery: string = '';
    public hideSearchBlock: boolean = false;
    public currentLanguage: ILanguage;
    public isDesktop: boolean;

    protected games: Game[];
    protected filterChangedCounter: number = 0;
    protected lazyTimeout: number;
    protected paginate: number;
    protected placeHoldersCount: number;
    protected prevPlaceHoldersCount: number;
    protected gamesRows: number;
    protected gamesRowsLoaded: number = 0;
    protected gamesRowsMedia: number = 1;
    protected categoryTitle: string;
    protected filterName: string;
    protected parentCategory: CategoryModel;
    protected childCategory: CategoryModel;
    protected deviceType: DeviceType;
    protected lastPlayedLoaded: boolean = false;
    protected favouritesLoaded: boolean = false;
    protected jackpotsLoaded: boolean = false;

    @ViewChild('gameList') gameListElement: ElementRef;
    @ViewChild('gameItem') gameItem: ElementRef;
    @ViewChild('gameBanner') gameBanner: ElementRef;
    @Input() protected inlineParams: Params.IGamesGridCParams;
    @Input() protected gamesList: Game[];

    @Output() public gridHidden = new EventEmitter<void>();
    @HostBinding('class.d-none') protected hideComponent: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IGamesGridCParams,
        protected router: UIRouter,
        protected gamesCatalogService: GamesCatalogService,
        protected elementRef: ElementRef,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected translate: TranslateService,
        protected configService: ConfigService,
        protected renderer: Renderer2,
        protected transition: TransitionService,
        protected actionService: ActionService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, actionService);
        this.trackGames = this.trackGames.bind(this);
    }

    public trackGames(index, item): string {
        return `${this.filterChangedCounter}.${item.ID}`;
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.$params.wlcElement = this.$params.wlcElement || 'wlc-games-grid-' + this.getWlcSuffics();
        this.setWlcElementOnHost();

        const category: string = this.$params.filter?.['categories']?.[0] || this.$params.filter?.['category'];
        if (this.$params.titleIcon?.byCategory && category) {
            const folder = this.$params.titleIcon.folder || this.configService.get<string>('$menu.categoryMenu.icons.folder');
            const icon = folder ? `${folder}/${category}` : category;
            this.$params.titleIcon.name = icon.split('.').length > 1 ? icon : `${icon}.svg`;
        }

        if (this.$params.titleIcon?.name) {
            this.addModifiers('title-icon');
        }

        this.hideSearchBlock = this.$params.hideOnEmptySearch;
        this.useLazy = this.$params.moreBtn?.lazy || false;
        this.lazyTimeout = this.$params.moreBtn?.lazyTimeout || 1000;
        this.placeHolders = Array(6).fill(1);
        this.filterName = this.$params.searchFilterName || 'page';

        this.followBreakpoints();
        this.initEventListeners();
        await this.prepareGrid();
    }

    public ngAfterViewChecked(): void {
        if (this.gameListElement) {
            this.setGridParams(this.gameListElement, this.gameListElement.nativeElement.getBoundingClientRect().width);
            this.setPlaceHolders();
            if (this.useLazy) {
                this.tryLoadingGames();
            }
        }
    }

    public async prepareGrid(): Promise<void> {
        this.isReady = false;
        this.gamesRowsLoaded = 0;
        this.title = this.gamesCatalogService.getGamesTitleByState() || this.$params.title || this.categoryTitle;
        this.games = await this.getGames();
        this.filteredGames = this.games;
        this.isReady = true;

        if (!this.filteredGames.length && this.$params.hideEmpty) {
            this.hideComponent = true;
            this.gridHidden.emit();
        }
        this.cdr.detectChanges();
    }

    public onResize(event: ResizedEvent): void {
        if (!event.oldWidth || Math.abs(event.oldWidth - event.newWidth) > 20) {
            this.setGridParams(event.element.nativeElement, event.newWidth);
            this.setPlaceHolders();
            if (this.useLazy) {
                this.tryLoadingGames();
            }
        }
    }

    public loadMore(): void {
        if (this.gamesCount === this.games?.length) {
            return;
        }
        this.resetGamesRows();
        this.gamesRowsLoaded += this.gamesRows;
        this.checkGamesLength();
        this.setPlaceHolders();
        this.lazyReady = true;

        if (this.$params.moreBtn?.scrollToEnd) {
            setTimeout(() => {
                this.actionService.scrollTo(this.elementRef.nativeElement, {
                    position: 'end',
                    offsetY: 40,
                });
            }, 500);
        }
        this.cdr.detectChanges();
    }

    public get showDefaultHeader() {
        return (this.$params.showTitle || this.$params.showAllLink.use) && this.$params.themeMod !== 'header-inline';
    }

    /**
     * Init event listeners
     */
    protected initEventListeners(): void {
        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                this.deviceType = type;
                this.isDesktop = this.deviceType === DeviceType.Desktop;
                this.applyMobileSettings();
                this.applyTabletSettings();
                this.cdr.detectChanges();
            });

        this.eventService.subscribe({
            name: GamesFilterServiceEvents.FILTER_CHANGED,
            from: this.filterName,
        }, (filter: IGamesFilterData) => {
            this.onFilterChanged(filter);
        }, this.$destroy);

        if (this.$params.type === 'search') {
            this.eventService.subscribe({
                name: GamesFilterServiceEvents.FILTER_SEARCH,
                from: this.filterName,
            }, (filter: IGamesFilterData) => {
                this.changeFilter(filter);
                this.changeSearch(filter.searchQuery);
            }, this.$destroy);
        }

        if (this.useLazy) {
            fromEvent(window, 'scroll')
                .pipe(takeUntil(this.$destroy))
                .subscribe((event: Event) => this.tryLoadingGames());
        }

        const successTransitionListener = this.transition.onSuccess({}, (transition) => {
            this.prepareGrid();
        });

        this.$destroy.subscribe(() => {
            successTransitionListener();
        });
    }

    protected tryLoadingGames(): void {
        const currentPosition = window.scrollY + window.window.innerHeight;
        const elemBottom = (
            this.elementRef.nativeElement.getBoundingClientRect().top
            + window.scrollY + this.elementRef.nativeElement.getBoundingClientRect().height
        );
        if (currentPosition > elemBottom && this.lazyReady && this.gamesCount < this.filteredGames?.length) {
            this.lazyReady = false;
            setTimeout(() => {
                this.loadMore();
            }, this.lazyTimeout);
        }
    }

    /**
     * Set grid params
     *
     * @param el - Container with thumbnails
     * @param {number} width With of container
     */
    protected setGridParams(el: any, width: number): void {
        this.moreButtonChangeState(false);
        this.resetGamesCount();
        this.resetGamesRows();
        const itemWidth = this.gameItem?.nativeElement?.getBoundingClientRect().width;
        const bannerWidth = this.gameBanner?.nativeElement?.getBoundingClientRect().width || 0;

        width = this.$params.bannerSettings ? width - bannerWidth : width;

        this.prevPlaceHoldersCount = Math.floor(width / itemWidth) || 1;
        this.gamesRows += this.gamesRowsLoaded;
        this.paginate = this.prevPlaceHoldersCount * this.gamesRows;
        this.placeHoldersCount = this.prevPlaceHoldersCount;

        if (this.gamesCount > this.paginate) {
            while (this.gamesCount % this.prevPlaceHoldersCount !== 0) {
                this.gamesCount++;
            }
        } else {
            this.gamesCount = this.paginate;
        }

        if (this.$params.themeMod === 'header-inline') {
            this.gamesCount--;
        }

        if (this.$params.bannerSettings) {
            this.gamesCount += Math.floor(bannerWidth / itemWidth) * this.gamesRowsLoaded;
        }

        this.checkGamesLength();
        this.cdr.detectChanges();
    }

    protected checkGamesLength(): void {
        if (this.filteredGames?.length && this.gamesCount >= this.filteredGames?.length) {
            this.moreButtonChangeState(true);
            this.gamesCount = this.filteredGames.length;
            if (this.gamesCount % this.prevPlaceHoldersCount) {
                this.placeHoldersCount = this.prevPlaceHoldersCount - this.gamesCount % this.prevPlaceHoldersCount;
            } else {
                this.placeHoldersCount = this.prevPlaceHoldersCount;
            }
        }
    }

    protected setPlaceHolders(): void {
        if (!this.$params.usePlaceholders) {
            return;
        }
        this.placeHolders = Array(this.placeHoldersCount).fill(1);
        const imgSize = this.gameItem?.nativeElement?.getBoundingClientRect().width;
        if (imgSize) {
            this.placeHolderStyles = {
                width: imgSize.width + 'px',
                height: imgSize.height + 'px',
            };
        }
    }

    /**\
     * Get games
     *
     * @returns {Promise<Game[]>}
     */
    protected async getGames(): Promise<Game[]> {
        await this.gamesCatalogService.ready;

        return new Promise<Game[]>(async (resolve, reject) => {
            let games: Game[] = this.gamesCatalogService.getGameList();
            if (games) {
                const gamesList = await this.getFilteredGames();
                resolve(gamesList);
            }
            this.eventService.subscribe({
                name: gamesEvents.FETCH_GAME_CATALOG_SUCCEEDED,
            }, () => {
                (async () => {
                    const gamesList = await this.getFilteredGames();
                    resolve(gamesList);
                })();
            });
        });
    }

    /**
     * Get filtered games
     *
     * @returns {Game[]}
     */
    protected async getFilteredGames(): Promise<Game[]> {
        let games: Game[] = [];

        if (this.gamesList?.length) {
            games = this.gamesList;

        } else if (this.$params.tournamentGamesFilter) {
            games = this.gamesCatalogService.getTournamentGames(this.$params.tournamentGamesFilter);

        } else if (this.$params.byState) {
            games = await this.gamesCatalogService.getGamesByState();

        } else if (this.$params.filter) {
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

            games = this.gamesCatalogService.getGameList(filter);
            const category = this.gamesCatalogService.getCategoryBySlug(cat);

            if (category) {
                const currentLang = this.router.stateService.params?.locale || 'en';
                this.categoryTitle = category.title[currentLang] || category.title['en'];
            }
        } else {
            games = this.gamesCatalogService.getGameList();
        }
        return games;
    }

    /**
     * Preload special games (favourites, last played)
     *
     * @param {IGamesFilterData} filter
     * @returns {Promise<void>}
     */
    protected async preloadSpecialGames(filter?: IGamesFilterData): Promise<void> {
        if (!this.favouritesLoaded && _includes(filter?.categories, 'favourites')) {
            await this.gamesCatalogService.getFavouriteGames();
            this.favouritesLoaded = true;
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
        await this.preloadSpecialGames(filter);
        this.changeFilter(filter);
        this.isReady = true;
        this.cdr.detectChanges();
    }

    protected changeFilter(filter: IGamesFilterData): void {
        this.filteredGames = this.gamesCatalogService.getGameList(filter);
        this.filterChangedCounter++;
    }

    protected changeSearch(search: string): void {
        this.searchQuery = search;
        if (this.searchQuery) {
            this.hideSearchBlock = false;
        } else {
            this.hideSearchBlock = this.$params.hideOnEmptySearch;
        }

        this.gamesCount = this.paginate;
        this.moreButtonChangeState();
        this.cdr.detectChanges();
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

        this.hideShowMoreBtn = this.filteredGames?.length < this.paginate;
    }

    protected applyMobileSettings(): void {
        if (this.deviceType === DeviceType.Mobile && this.$params.mobileSettings?.showLoadButton) {
            this.$params.moreBtn.hide = false;
        }
    }

    protected applyTabletSettings(): void {
        if (this.deviceType === DeviceType.Tablet && this.$params.tabletSettings?.showLoadButton) {
            this.$params.moreBtn.hide = false;
        }
    }

    protected getWlcSuffics(): string {
        if (this.$params.filter) {
            return _reduce(_keys(this.$params.filter).sort(), (res, item) => {
                res.push(item + '-' + this.$params.filter[item]);
                return res;
            }, []).join('-');

        } else {
            return 'all-games';
        }
    }

    protected resetGamesCount(): void {
        this.gamesCount = this.configService.get<number>('$games.components.wlc-games-grid.defaultCount') || 1;
    }

    protected resetGamesRows(): void {
        if (this.$params.breakpoints) {
            this.gamesRows = this.gamesRowsMedia;
            return;
        }

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

    protected followBreakpoints(): void {
        const breakpoints: string[] = _keys(this.$params.breakpoints);

        _each(breakpoints, (breakpoint: string, index: number) => {
            const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);

            if (mediaQuery.matches) {
                this.gamesRowsMedia = this.$params.breakpoints[breakpoint].gamesRows;
            }

            GlobalHelper.mediaQueryObserver(mediaQuery)
                .pipe(takeUntil(this.$destroy))
                .subscribe((event: MediaQueryListEvent) => {
                    const key = breakpoints[index];
                    const keyPrev = breakpoints[index - 1];

                    if (event.matches) {
                        this.gamesRowsMedia = this.$params.breakpoints[key].gamesRows;
                    } else if (keyPrev) {
                        this.gamesRowsMedia = this.$params.breakpoints[keyPrev].gamesRows;
                    } else {
                        this.gamesRowsMedia = this.$params.gamesRows;
                    }

                    if (this.gameListElement) {
                        this.setGridParams(this.gameListElement, this.gameListElement.nativeElement.getBoundingClientRect().width);
                        this.setPlaceHolders();

                        if (this.useLazy) {
                            this.tryLoadingGames();
                        }
                    }

                    this.cdr.markForCheck();
                });
        });
    }
}
