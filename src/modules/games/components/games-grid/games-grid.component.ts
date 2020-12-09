import {
    Component,
    OnInit,
    Inject,
    ElementRef,
    AfterViewInit,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    Renderer2,
    Input,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UIRouter} from '@uirouter/core';
import {fromEvent} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {EventService} from 'wlc-engine/modules/core/system/services';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    defaultParams,
    IGamesGridCParams,
} from './games-grid.params';
import {ResizedEvent} from 'angular-resize-event';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {
    ConfigService,
    ILanguage,
} from 'wlc-engine/modules/core';
import {
    CategoriesService,
    GamesCatalogService,
} from 'wlc-engine/modules/games';
import {GamesFilterServiceEvents} from 'wlc-engine/modules/games';

import {
    filter as _filter,
    find as _find,
    includes as _includes,
    extend as _extend,
    get as _get,
    isUndefined as _isUndefined,
} from 'lodash';
import {gamesEvents, IGames} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {GamesCatalog} from 'wlc-engine/modules/games/system/models/games-catalog.model';
import {IGamesFilterData} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';

@Component({
    selector: '[wlc-games-grid]',
    templateUrl: './games-grid.component.html',
    styleUrls: ['./styles/games-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesGridComponent extends AbstractComponent
    implements OnInit, AfterViewInit {

    public $params: IGamesGridCParams;
    public filteredGames: Game[]; // TODO temporary: until gameService will be able to back category
    public title: string;
    public gamesCount: number;
    public placeHolders: number[];
    public placeHolderStyles: object = {};
    public hideShowMoreBtn: boolean = false;
    public useLazy: boolean;
    public lazyReady: boolean = true;
    public searchQuery: string = '';
    public hideSearchBlock: boolean = false;
    public currentLanguage: ILanguage;

    protected games: Game[];
    protected lazyTimeout: number;
    protected paginate: number;
    protected placeHoldersCount: number;
    protected prevPlaceHoldersCount: number;
    protected categoryTitle: string;
    protected filterName: string;
    protected parentCategory: CategoryModel;
    protected childCategory: CategoryModel;

    @Input() protected inlineParams: IGamesGridCParams;

    constructor(
        public router: UIRouter,
        protected gamesCatalogService: GamesCatalogService,
        @Inject('injectParams') protected injectParams: IGamesGridCParams,
        protected elementRef: ElementRef,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected translate: TranslateService,
        protected configService: ConfigService,
        protected renderer: Renderer2,
        protected categoriesService: CategoriesService,
    ) {
        super({injectParams, defaultParams}, configService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.$params = _extend({}, defaultParams, this.injectParams, this.inlineParams); // TODO delete costil params not working
        this.games = await this.getGames();

        if (this.childCategory) {
            this.title = this.childCategory.title[this.translate.currentLang];
        } else if (this.parentCategory) {
            this.title = this.parentCategory.title[this.translate.currentLang];
        } else {
            this.title = this.$params?.title || this.categoryTitle;
        }

        this.filteredGames = this.games;
        this.hideSearchBlock = this.$params?.hideOnEmptySearch;

        this.useLazy = this.$params?.moreBtn?.lazy || false;
        this.lazyTimeout = this.$params?.moreBtn?.lazyTimeout || 1000;
        this.placeHolders = Array(6).fill(1);
        this.cdr.detectChanges();
        this.filterName = this.$params.searchFilterName || 'page';

        this.currentLanguage = _find(this.configService.get<ILanguage[]>('appConfig.languages'), {
            code: this.translate.currentLang,
        });

        if (this.$params?.type === 'search') {
            this.initSearchListener();
        }

        this.initFilterListener();

        if (this.useLazy) {
            this.initScrollListener();
        }
    }

    public ngAfterViewInit(): void {
        const listElement = this.elementRef.nativeElement.querySelector('.' + this.$class + '__list');
        if (listElement) {
            this.setGridParams(listElement, listElement.getBoundingClientRect().width);
            this.setPlaceHolders();
            if (this.useLazy) {
                this.tryLoadingGames();
            }
        }
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
        this.cdr.detectChanges();
    }

    // TODO: to delete this test
    public changeGames(): void {
        this.games = this.games.slice(0, 12);
        this.moreButtonChangeState(false);
        this.checkGamesLength();
        this.setPlaceHolders();
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

    protected setGridParams(el: any, width: number): void {
        this.moreButtonChangeState(false);
        const itemElement = el.querySelector('.' + this.$class + '__item')?.firstChild;
        const itemWidth = itemElement?.getBoundingClientRect().width;
        this.prevPlaceHoldersCount = Math.floor(width / itemWidth);
        if (this.prevPlaceHoldersCount && this.prevPlaceHoldersCount < 10) {
            this.paginate = this.prevPlaceHoldersCount * this.$params.gamesRows;
            this.placeHoldersCount = this.prevPlaceHoldersCount;
            this.gamesCount = this.paginate;
            this.checkGamesLength();
        }
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
        if (!this.$params?.usePlaceholders) {
            return;
        }
        this.placeHolders = Array(this.placeHoldersCount).fill(1);
        const imgElement = this.elementRef.nativeElement.querySelector('.' + this.$class + '__item')?.firstChild;
        const imgSize = imgElement?.getBoundingClientRect();
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
        return new Promise<Game[]>((resolve, reject) => {
            let games: Game[] = this.gamesCatalogService.getGameList();
            if (games) {
                resolve(this.getFilteredGames());
            }
            this.eventService.subscribe({
                name: gamesEvents.FETCH_GAME_CATALOG_SUCCEEDED,
            }, () => {
                resolve(this.getFilteredGames());
            });
        });
    }

    /**
     * Get filtered games
     *
     * @returns {Game[]}
     */
    protected getFilteredGames(): Game[] {
        this.parentCategory = this.gamesCatalogService.getParentCategoryByState();
        this.childCategory = this.gamesCatalogService.getChildCategoryByState();

        let games = this.gamesCatalogService.getGameList();
        if (this.$params?.byState) {
            const category: CategoryModel = this.childCategory || this.parentCategory;
            games = this.gamesCatalogService.getGamesByCategories([category]);
        } else if (this.$params?.filter) {
            // TODO: move to games service
            const categories: CategoryModel[] = this.gamesCatalogService.getCategories();
            const category = _find(categories, (item: CategoryModel) => {
                return item?.slug === this.$params.filter.category;
            });
            if (!categories || !category) {
                return;
            }
            const currentLang = this.router.stateService.params?.locale || 'en';
            this.categoryTitle = category.title[currentLang];

            games = _filter(games, (item: Game) => {
                return _includes(item.categoryID, category.id);
            });
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
            this.hideSearchBlock = this.$params?.hideOnEmptySearch;
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

}
