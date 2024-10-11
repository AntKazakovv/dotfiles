import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Injector,
} from '@angular/core';

import _assignIn from 'lodash-es/assignIn';

import {AbstractComponent} from 'wlc-engine/modules/core';
import {
    ISearchCParams,
    defaultParams,
    defaultGamesGridParams,
} from './search-v2.params';
import {
    SearchDefaultComponent,
    SearchEasyComponent,
    SearchControllerDefault,
    SearchControllerEasy,
} from 'wlc-engine/modules/games/components/search-v2';
import {CustomHook} from 'wlc-engine/modules/core/system/decorators/hook.decorator';

type TController = InstanceType<typeof SearchControllerDefault | typeof SearchControllerEasy>;

@Component({
    selector: '[wlc-search]',
    templateUrl: './search-v2.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SearchControllerDefault, SearchControllerEasy],
})
export class SearchV2Component extends AbstractComponent implements OnInit {
    public override $params: ISearchCParams;
    protected $controller: TController;
    protected rootThemeComponent: typeof SearchDefaultComponent | typeof SearchEasyComponent;

    constructor(
        @Inject('injectParams') protected injectParams: ISearchCParams,
        protected injector: Injector,
    ) {
        super({
            injectParams: {},
            defaultParams: defaultParams,
        });
    }

    @CustomHook('games', 'searchV2NgOnInit')
    public override ngOnInit(): void {
        super.ngOnInit();
        const controllerToken = this.$params.theme === 'easy' ? SearchControllerEasy : SearchControllerDefault;
        this.$controller = this.injector.get<TController>(controllerToken);

        (this.$controller instanceof SearchControllerEasy)
            ? this.initEasySearch()
            : this.initDefaultSearch();

        this.rootThemeComponent = this.$controller.rootThemeComponent;
    }

    protected initEasySearch(): void {
        const gamesGridParams = this.$params.easyThemeParams.searchGamesGrid;
        const {hideOnFindGames, swiperOptionsOnHideSecondBlock} = this.$params.easyThemeParams.secondBlock;

        if (hideOnFindGames) {
            gamesGridParams.showAsSwiper = swiperOptionsOnHideSecondBlock;
            this.$params.easyThemeParams.secondBlock.gamesGrid.showAsSwiper = swiperOptionsOnHideSecondBlock;
        }
        (this.$controller as SearchControllerEasy).init({
            titleText: this.$params.titleText,
            searchFilterName: gamesGridParams.searchFilterName,
            theme: this.$params.theme,
            searchFieldParams: this.$params.searchInputParams,
            gamesGridParams: gamesGridParams,
            secondBlock: this.$params.easyThemeParams.secondBlock,
            emptyText: this.$params.easyThemeParams.emptyText,
            recentSearchText: this.$params.easyThemeParams.recentSearchText,
            showMerchantsFirst: this.$params.easyThemeParams.showMerchantsFirst,
            recommendedText: this.$params.easyThemeParams.recommendedText,
        });
    }

    protected initDefaultSearch(): void {
        const gamesGridParams = _assignIn(
            {},
            defaultGamesGridParams,
            this.$params.common?.gamesGridParams,
        );
        (this.$controller as SearchControllerDefault).init({
            titleText: this.$params.titleText,
            searchFilterName: gamesGridParams.searchFilterName,
            theme: this.$params.theme,
            gamesGridParams: gamesGridParams,
            openProviders: this.$params.common.openProvidersList,
            searchFieldParams: this.$params.searchInputParams,
        });
    }
}
