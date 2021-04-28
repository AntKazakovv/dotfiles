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
    ListAppearanceAnimation,
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

@Component({
    selector: '[wlc-games-grid]',
    templateUrl: './games-grid.component.html',
    styleUrls: ['./styles/games-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        ...ListAppearanceAnimation,
    ],
})
export class GamesGridComponent extends AbstractComponent
    implements OnInit, AfterViewChecked {

    public $params: Params.IGamesGridCParams;
    public isReady: boolean = false;
    public filteredGames: Game[]; // TODO temporary: until gameService will be able to back category
    public title: string;
    public gamesCount: number = this.configService.get<number>('$games.components.wlc-games-grid.defaultCount') || 1;
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
    protected lazyTimeout: number;
    protected paginate: number;
    protected placeHoldersCount: number;
    protected prevPlaceHoldersCount: number;
    protected categoryTitle: string;
    protected filterName: string;
    protected parentCategory: CategoryModel;
    protected childCategory: CategoryModel;
    protected deviceType: DeviceType;

    @ViewChild('gameList') gameListElement: ElementRef;
    @ViewChild('gameItem') gameItem: ElementRef;
    @ViewChild('gameBanner') gameBanner: ElementRef;
    @Input() protected inlineParams: Params.IGamesGridCParams;
    @Input() protected gamesList: Game[];

    @Output() public gridHidden = new EventEmitter<void>();
    @HostBinding('class.d-none') protected hideComponent: boolean = false;

    constructor(
        public router: UIRouter,
        protected gamesCatalogService: GamesCatalogService,
        @Inject('injectParams') protected injectParams: Params.IGamesGridCParams,
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

        this.initDeviceTypeListener();
        this.setupMobileSettings();

        this.hideSearchBlock = this.$params.hideOnEmptySearch;
        this.useLazy = this.$params.moreBtn?.lazy || false;
        this.lazyTimeout = this.$params.moreBtn?.lazyTimeout || 1000;
        this.placeHolders = Array(6).fill(1);
        this.filterName = this.$params.searchFilterName || 'page';

        await this.prepareGrid();
        this.transition.onSuccess({}, async (transition) => {
            this.prepareGrid();
        });

        if (this.$params.type === 'search') {
            this.initSearchListener();
        }

        this.initFilterListener();

        if (this.useLazy) {
            this.initScrollListener();
        }
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
        this.games = await this.getGames();
        const lang: string = this.translate.currentLang;
        if (this.childCategory) {
            this.title = this.childCategory.title[lang] || this.childCategory.title['en'];
        } else if (this.parentCategory) {
            this.title = this.parentCategory.title[lang] || this.parentCategory.title['en'];
        } else {
            this.title = this.$params.title || this.categoryTitle;
        }
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
        this.gamesCount += this.paginate;
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

    protected initScrollListener(): void {
        fromEvent(window, 'scroll')
            .pipe(takeUntil(this.$destroy))
            .subscribe((event: Event) => this.tryLoadingGames());
    }

    protected tryLoadingGames(): void {
        const currentPosition = window.scrollY + window.window.innerHeight;
        const elemBottom = (
            this.elementRef.nativeElement.getBoundingClientRect().top
            + window.scrollY + this.elementRef.nativeElement.getBoundingClientRect().height
        );
        if (currentPosition > elemBottom && this.lazyReady && this.gamesCount < this.games?.length) {
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
        const itemWidth = this.gameItem?.nativeElement?.getBoundingClientRect().width;
        const bannerWidth = this.gameBanner?.nativeElement?.getBoundingClientRect().width || 0;
        width = this.$params.bannerSettings ? width - bannerWidth : width;
        this.prevPlaceHoldersCount = Math.floor(width / itemWidth) || 1;
        this.paginate = this.prevPlaceHoldersCount * this.$params.gamesRows;
        this.placeHoldersCount = this.prevPlaceHoldersCount;

        if (this.gamesCount > this.paginate) {
            while (this.gamesCount % this.prevPlaceHoldersCount !== 0) {
                this.gamesCount++;
            }
        } else {
            this.gamesCount = this.paginate;
        }

        this.checkGamesLength();
        this.cdr.markForCheck();
    }

    protected checkGamesLength(): void {
        if (this.games?.length && this.gamesCount >= this.games?.length) {
            this.moreButtonChangeState(true);
            this.gamesCount = this.games.length;
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
        this.parentCategory = this.gamesCatalogService.getParentCategoryByState();
        this.childCategory = this.gamesCatalogService.getChildCategoryByState();
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
                ids: this.$params.filter['ids'] || [],
                searchQuery: this.$params.filter['searchQuery'] || '',
            };

            const cat = this.$params.filter['categories']?.[0] || this.$params.filter['category'] || '';

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

    protected initSearchListener(): void {
        this.eventService.subscribe({
            name: GamesFilterServiceEvents.FILTER_SEARCH,
            from: this.filterName,
        }, (filter: IGamesFilterData) => {
            this.changeFilter(filter);
            this.changeSearch(filter.searchQuery);
        }, this.$destroy,
        );
    }

    protected initFilterListener(): void {
        this.eventService.subscribe({
            name: GamesFilterServiceEvents.FILTER_CHANGED,
            from: this.filterName,
        }, (filter: IGamesFilterData) => {
            this.changeFilter(filter);
            this.cdr.markForCheck();
        }, this.$destroy);
    }

    protected changeFilter(filter: IGamesFilterData): void {
        this.filteredGames = this.gamesCatalogService.getGameList(filter);
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

        this.hideShowMoreBtn = this.filteredGames?.length < this.paginate;
    }

    protected initDeviceTypeListener(): void {
        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                this.deviceType = type;
                this.isDesktop = this.deviceType === 'desktop';
                this.setupMobileSettings();
                this.cdr.markForCheck();
            });
    }

    protected setupMobileSettings(): void {
        if (this.deviceType === DeviceType.Mobile) {
            if (this.$params.mobileSettings?.showLoadButton) {
                this.$params.moreBtn.hide = false;
            }

            this.$params.gamesRows = this.$params.mobileSettings?.gamesRows || this.$params.gamesRows;
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
}
