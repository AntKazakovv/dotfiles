import {
    Injectable,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {
    BehaviorSubject,
    Observable,
    Subject,
} from 'rxjs';

import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {ISearchFieldCParams} from 'wlc-engine/modules/games/components/search-field/search-field.params';
import {
    IGamesGridCParams,
    IShowAsSwiper,
} from 'wlc-engine/standalone/games/components/games-grid/games-grid.params';
import {
    AbstractSearchController,
    SearchControlEasyComponent,
    SearchResultEasyComponent,
    SearchLastQueriesComponent,
    SearchEasyComponent,
} from 'wlc-engine/modules/games/components/search-v2';

export interface ISearchLastQueriesEvent {
    event: string;
    index: number;
}

export interface ISecondBlockParams {
    hideOnFindGames?: boolean;
    swiperOptionsOnHideSecondBlock?: IShowAsSwiper;
    gamesGrid?: IGamesGridCParams;
}

export interface IControllerEasyParams {
    titleText: string,
    gamesGridParams: IGamesGridCParams,
    searchFieldParams: ISearchFieldCParams,
    searchFilterName: string,
    theme: string,
    secondBlock: ISecondBlockParams,
    emptyText: string,
    recentSearchText: string,
    showMerchantsFirst: boolean,
    recommendedText: string,
}

@Injectable()
export class SearchControllerEasy extends AbstractSearchController<IControllerEasyParams> {
    public fieldWasClicked: boolean = false;
    public readonly lastQueries$: Observable<string[]> = this.gamesFilterService.lastQueries$;
    public readonly visibleGames$: BehaviorSubject<Game[]> = new BehaviorSubject([]);
    public readonly controlPanel = SearchControlEasyComponent;
    public readonly lastQueryList = SearchLastQueriesComponent;
    public readonly rootThemeComponent = SearchEasyComponent;
    public readonly searchResult = SearchResultEasyComponent;

    protected readonly _eventsLastQueries$ = new Subject<ISearchLastQueriesEvent>();

    public override init(paramsController: IControllerEasyParams): void {
        super.init(paramsController);
        this.searchFieldCParams = paramsController.searchFieldParams;
        this.gamesCatalogService.ready.then(()=> {
            this.initSubscribers();
            this.$resolveReady();
        });
    }

    public get eventsLastQueries$(): Observable<ISearchLastQueriesEvent> {
        return this._eventsLastQueries$.asObservable();
    }

    public get showSecondBlock(): boolean {
        return !this.props.secondBlock.hideOnFindGames
        || !this.visibleGames$.getValue().length;
    }

    public get searchParams(): ISearchFieldCParams {
        return this.searchFieldCParams;
    }

    public setValueEventsLastQueries(event: ISearchLastQueriesEvent): void {
        this._eventsLastQueries$.next(event);
    }

    public deleteQuery(index: number): void {
        this.gamesFilterService.deleteQuery(index);
    }

    public addLastQueries(query: string): void {
        this.gamesFilterService.setLastQuery(query);
    }

    public setValueSearchQuery(query: string): void {
        this.searchQuery = query;
        this.setFilteredGames(query);
    }

    protected searchQuerySubscribe(): void {
        this.searchQuery$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((query: string) => {
                this.setFilteredGames(query);
            });
    }

    protected initSubscribers(): void {
        this.searchQuerySubscribe();
        this.eventsLastQueriesSubscribe();
    }

    protected eventsLastQueriesSubscribe(): void {
        this._eventsLastQueries$
            .pipe(
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((data: ISearchLastQueriesEvent) => {
                switch (data.event) {
                    case 'choose':
                        this.chooseQuery(data.index);
                        break;
                    case 'delete':
                        this.deleteQuery(data.index);
                        break;
                }
            });
    }

    protected chooseQuery(index: number): void {
        const query = this.gamesFilterService.lastQueries[index];

        if (!query || this.searchQuery === query) {
            return;
        }
        this.setValueSearchQuery(query);
        this.fieldWasClicked = true;
        this.addLastQueries(query);
    }

    protected setFilteredGames(query: string): void {
        this.visibleGames$.next(this.gamesCatalogService.searchByQuery(
            query,
            this.props.showMerchantsFirst,
        ));
    }
}
