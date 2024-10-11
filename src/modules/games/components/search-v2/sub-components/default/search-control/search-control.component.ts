import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
} from '@angular/core';

import {takeUntil} from 'rxjs';

import {AbstractComponent} from 'wlc-engine/modules/core';
import {openCloseAnimations} from 'wlc-engine/modules/games/system/animations/search.animations';
import {
    SearchControllerDefault,
    SearchMerchantListComponent,
    SearchCategoriesListComponent,
} from 'wlc-engine/modules/games/components/search-v2';

import * as Params from './search-control.params';

@Component({
    selector: '[wlc-search-control]',
    templateUrl: './search-control.component.html',
    styleUrls: ['./styles/search-control.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [openCloseAnimations],
})
export class SearchControlComponent extends AbstractComponent implements OnInit {
    protected openPanel: string | null;
    protected categoriesLength: number;
    protected merchantsLength: number;
    protected merchantsListComponent: typeof SearchMerchantListComponent;
    protected categoriesListComponent: typeof SearchCategoriesListComponent;

    constructor(
        @Inject (SearchControllerDefault) protected $searchControllerDefault: SearchControllerDefault,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.setComponents();
        this.setSubscriberFilters();
        this.checkPanelState();
    }

    public setComponents(): void {
        this.merchantsListComponent = this.$searchControllerDefault.merchantsList;
        this.categoriesListComponent = this.$searchControllerDefault.categoriesList;
    }

    public setSearchQuery(event: string): void {
        this.$searchControllerDefault.searchQuery = event;
    }

    public togglePanel(panel: string): void {
        this.openPanel = this.openPanel === panel ? null : panel;
    }

    public setSubscriberFilters(): void {
        this.$searchControllerDefault.filters$
            .pipe(
                takeUntil(this.$destroy),
            )
            .subscribe((filter) => {
                this.categoriesLength = filter.categories?.length;
                this.merchantsLength = filter.merchants?.length;
                this.closePanel();
            });
    }

    protected checkPanelState(): void {
        if (this.$searchControllerDefault.props.openProviders) {
            this.togglePanel('merchants');
        }
    }

    protected closePanel(): void {
        if (this.$searchControllerDefault.props.oneTapClosePanel) {
            this.openPanel = null;
        }
    }
}
