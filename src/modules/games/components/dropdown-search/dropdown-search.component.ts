import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    ViewChild,
    ElementRef,
} from '@angular/core';

import {
    AbstractComponent,
    EventService,
} from 'wlc-engine/modules/core';
import {
    GamesFilterService,
    GamesFilterServiceEvents,
} from 'wlc-engine/modules/games/system/services/games-filter.service';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {IGamesFilterData} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';
import {ISearchFieldCParams} from 'wlc-engine/modules/games/components/search-field/search-field.params';

import {
    IDropdownSearchCParams,
    defaultParams,
} from './dropdown-search.params';

@Component({
    selector: '[wlc-dropdown-search]',
    templateUrl: './dropdown-search.component.html',
    styleUrls: ['./styles/dropdown-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownSearchComponent extends AbstractComponent implements OnInit {

    @ViewChild('searchContainer') protected searchContainer: ElementRef;

    public ready: boolean = false;
    public isOpened: boolean = false;
    public filters: IGamesFilterData = {
        searchQuery: null,
        categories: [],
        merchants: [],
        excludeCategories: [],
        excludeMerchants: [],
    };
    public searchFieldParams: ISearchFieldCParams;
    public override $params: IDropdownSearchCParams;

    constructor(
        @Inject('injectParams') protected injectParams: IDropdownSearchCParams,
        protected eventService: EventService,
        protected gamesCatalogService: GamesCatalogService,
        protected gamesFilterService: GamesFilterService,
        protected host: ElementRef,
    ) {
        super({
            injectParams: injectParams,
            defaultParams: defaultParams,
        });
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        await this.gamesCatalogService.ready;

        this.searchFieldParams = {
            searchQueryFromCache: this.filters.searchQuery,
            searchFrom: this.$params.gamesGridParams?.searchFilterName,
            emitNullQuery: true,
            isDropdown: true,
        };

        this.initSearchListener();

        this.ready = true;
        this.cdr.detectChanges();
    }

    /**
     * Disabled scrolling when the search is open
     *
     * @return void
     */
    public clickOnTheSearchField(): void {
        if(!this.isOpened) {
            this.isOpened = true;
        }
    }

    /**
     * Close dropdown search
     *
     * @return void
     */
    public clickOutside(): void {
        this.isOpened = false;
    }

    /**
     * Passes search query to false
     *
     * @param query {string} - Search query
     * @return void
     */
    public setSearchQuery(query: string): void {
        this.filters.searchQuery = query;
        this.setFilter();

        if (this.filters.searchQuery) {
            this.isOpened = true;
        }
    }

    protected initSearchListener(): void {
        this.eventService.subscribe({
            name: GamesFilterServiceEvents.FILTER_SEARCH,
            from: this.$params.gamesGridParams?.searchFilterName,
        }, (data: IGamesFilterData): void => {
            this.filters.searchQuery = data.searchQuery;
        },
        this.$destroy);
    }

    protected setFilter(): void {
        this.gamesFilterService.set(this.$params.gamesGridParams?.searchFilterName, this.filters, true);
    }
}
