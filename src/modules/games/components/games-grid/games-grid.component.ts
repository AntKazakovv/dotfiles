import {Component, OnInit, Inject, ElementRef, AfterViewInit, HostListener, ChangeDetectorRef} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {defaultParams, IGGParams} from './games-grid.params';
import {ResizedEvent} from 'angular-resize-event';
import {Game} from 'wlc-engine/modules/games/models/game.model';
import {GamesCatalogService} from 'wlc-engine/modules/games';

import {
    filter as _filter,
    find as _find,
    includes as _includes,
    extend as _extend,
} from 'lodash';
import {ICategory} from '../../interfaces/games.interfaces';
import {UIRouter} from '@uirouter/core';

@Component({
    selector: '[wlc-games-grid]',
    templateUrl: './games-grid.component.html',
    styleUrls: ['./games-grid.component.scss'],
})
export class GamesGridComponent extends AbstractComponent implements OnInit, AfterViewInit {
    public $params: IGGParams;
    public games: Game[];
    public title: string;
    public gamesCount: number;
    public placeHolders: number[];
    public placeHolderStyles: object = {};
    public hideShowMoreBtn: boolean = false;
    public useLazy: boolean;
    public lazyReady: boolean = true;

    protected lazyTimeout: number;
    protected paginate: number ;
    protected placeHoldersCount: number;
    protected prevPlaceHoldersCount: number;
    protected categoryTitle: string;

    constructor(
        public router: UIRouter,
        protected gamesCatalogService: GamesCatalogService,
        @Inject('injectParams') protected injectParams: IGGParams,
        protected elementRef: ElementRef,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams});
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.$params = _extend({}, defaultParams, this.injectParams); // TODO delete costil params not working
        this.games = await this.getGames();
        this.title = this.$params?.title || this.categoryTitle; // TODO: get title also from state
        this.useLazy = this.$params?.moreBtn?.lazy || false;
        this.lazyTimeout = this.$params?.moreBtn?.lazyTimeout || 1000;
        this.placeHolders = Array(6).fill(1);
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
        this.cdr.detectChanges();
    }

    // TODO: to delete this test
    public changeGames(): void {
        this.games = this.games.slice(0, 12);
        this.hideShowMoreBtn = false;
        this.checkGamesLength();
        this.setPlaceHolders();
    }

    @HostListener('window:scroll') onScroll(e: Event): void {
        if (this.useLazy) {
            this.tryLoadingGames();
        }
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
        this.hideShowMoreBtn = false;
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
            this.hideShowMoreBtn = true;
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
                height: imgSize.height + 'px'
            }
        }
    }

    protected async getGames(): Promise<Game[]> {
        // TODO это временно запихнуто
        await this.gamesCatalogService.load();
        let games: Game[] = this.gamesCatalogService.getGameList();

        if (this.$params?.byState) {
            console.log('getgames by state', this.$params.byState);
        } else if (this.$params?.filter) {
            // TODO: move to games service
            const categories = this.gamesCatalogService.getCategories();
            const category = _find(categories, (item: ICategory) => {
                return item?.Slug === this.$params.filter.category;
            });
            if (!categories || !category) {
                return
            }
            const currentLang = this.router.stateService.params?.locale || 'en';
            this.categoryTitle = category.Name[currentLang];

            games = _filter(games, (item: Game) => {
                return _includes(item.CategoryID, category.ID);
            });
        }

        return games;
    }

}
