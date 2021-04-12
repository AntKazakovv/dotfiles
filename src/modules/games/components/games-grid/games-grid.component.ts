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
import {
    UIRouter,
    TransitionService,
} from '@uirouter/core';
import {
    animate, query, stagger,
    style,
    transition,
    trigger,
} from '@angular/animations';
import {fromEvent} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {ActionService, EventService} from 'wlc-engine/modules/core/system/services';
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
    DeviceType,
} from 'wlc-engine/modules/core';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games';
import {GamesFilterServiceEvents} from 'wlc-engine/modules/games';
import {gamesEvents} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {IGamesFilterData} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';
import {ITournamentGames} from 'wlc-engine/modules/tournaments';
import {GamesHelper} from 'wlc-engine/modules/games/system/helpers/games.helpers';

import {
    filter as _filter,
    map as _map,
    includes as _includes,
    reduce as _reduce,
    keys as _keys,
    isUndefined as _isUndefined,
} from 'lodash-es';

@Component({
    selector: '[wlc-games-grid]',
    templateUrl: './games-grid.component.html',
    styleUrls: ['./styles/games-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('appearance', [
            transition('*<=>*', [
                query(':enter', [
                    style({opacity: 0}),
                    stagger('0.03s', animate('0.8s', style({opacity: 1}))),
                ], {optional: true}),
            ]),
        ]),
    ],
})
export class GamesGridComponent extends AbstractComponent
    implements OnInit, AfterViewInit {

    public $params: IGamesGridCParams;
    public isReady: boolean = false;
    public filteredGames: Game[]; // TODO temporary: until gameService will be able to back category
    public title: string;
    public gamesCount: number = this.configService.get<number>('$games.components.wlc-games-grid.defaultCount') || 12;
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

    @Input() protected inlineParams: IGamesGridCParams;
    @Input() protected gamesList: Game[];

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
        protected transition: TransitionService,
        protected actionService: ActionService,
    ) {
        super({injectParams, defaultParams}, configService, actionService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.$params.wlcElement = this.$params.wlcElement || 'wlc-games-grid-' + this.getWlcSuffics();
        this.setWlcElementOnHost();

        if (this.$params.titleIcon?.byCategory && this.$params.filter.category) {
            const folder = this.$params.titleIcon.folder || this.configService.get<string>('$menu.categoryMenu.icons.folder');
            const icon = folder ? `${folder}/${this.$params.filter.category}` : this.$params.filter.category;
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

        this.cdr.detectChanges();
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

        setTimeout(() => {
            this.actionService.scrollTo(this.elementRef.nativeElement, {
                position: 'end',
                offsetY: 40,
            });
        }, 500);
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
        const itemElement = el.querySelector('.' + this.$class + '__item')?.firstChild;
        const itemWidth = itemElement?.getBoundingClientRect().width;
        this.prevPlaceHoldersCount = Math.floor(width / itemWidth);
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
        let games:Game[] = [];

        if (this.gamesList?.length) {
            games = this.gamesList;
        } else if (this.$params.tournamentGamesFilter) {
            return this.gamesCatalogService.getTournamentGames(this.$params.tournamentGamesFilter);
        } else {
            games = this.gamesCatalogService.getGameList();
        }

        if (this.$params.byState) {
            games = await this.gamesCatalogService.getGamesByState();
        } else if (this.$params.filter) {
            games = await this.gamesCatalogService.getGamesByCategorySlug(this.$params.filter.category);
            const category = this.gamesCatalogService.getCategoryBySlug(this.$params.filter.category);
            if (category) {
                const currentLang = this.router.stateService.params?.locale || 'en';
                this.categoryTitle = category.title[currentLang] || category.title['en'];
            }
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
