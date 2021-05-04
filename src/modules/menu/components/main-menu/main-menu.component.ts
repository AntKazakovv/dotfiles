import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector,
    OnInit,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    LayoutService,
    EventService,
} from 'wlc-engine/modules/core';
import {
    gamesEvents,
    GamesCatalogService,
    CategoryModel,
} from 'wlc-engine/modules/games';
import {MenuHelper} from 'wlc-engine/modules/menu/system/helpers/menu.helper';

import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as Params from 'wlc-engine/modules/menu/components/main-menu/main-menu.params';
import * as Config from 'wlc-engine/modules/menu/system/config/main-menu.items.config';

import _clone from 'lodash-es/clone';
import _has from 'lodash-es/has';
import _sortBy from 'lodash-es/sortBy';
import _merge from 'lodash-es/merge';
import _pull from 'lodash-es/pull';

@Component({
    selector: '[wlc-main-menu]',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./styles/main-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent extends AbstractComponent implements OnInit {
    public items: MenuParams.IMenuItem[];
    public $params: Params.IMainMenuCParams;
    public commonMenuItems: MenuParams.MenuItemType[];

    protected menuConfig: MenuParams.MenuConfigItem[];
    protected useIcons: boolean;
    protected iconsFolder: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMainMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected injector: Injector,
        protected layoutService: LayoutService,
        protected gamesCatalogService: GamesCatalogService,
        protected translate: TranslateService,
        protected eventService: EventService,
        protected configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.IMainMenuCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    public ngOnInit(): void {

        super.ngOnInit();
        this.initConfig();
        this.initMenu();
    }

    protected initConfig(): void {
        this.menuConfig = this.configService.get<MenuParams.MenuConfigItem[]>('$menu.mainMenu.items');

        const useTournaments = this.configService.get<boolean>('$base.tournaments.use');
        if (!useTournaments) {
            this.menuConfig = _pull(this.menuConfig, 'main-menu:tournaments');
        }
    }

    protected initMenu(): void {
        this.useIcons = _has(this.$params, 'common.icons.use')
            ? this.$params.common.icons.use
            : this.configService.get<boolean>('$menu.mainMenu.icons.use');

        this.iconsFolder = this.$params.common?.icons?.folder || this.configService.get<string>('$menu.mainMenu.icons.folder');

        _merge(this.$params.menuParams, {
            wlcElement: this.$params.wlcElement || 'wlc-main-menu',
        });

        this.commonMenuItems = MenuHelper.parseMenuConfig(this.menuConfig, Config.wlcMainMenuItemsGlobal, {
            icons: {
                folder: this.iconsFolder,
                disable: !this.useIcons,
            },
        });

        this.$params.menuParams.items = this.commonMenuItems;
        this.$params.menuParams = _clone(this.$params.menuParams);

        if (this.gamesCatalogService.getGameList()) {
            this.addCategoryBtns();
        }

        this.eventService.subscribe({
            name: gamesEvents.FETCH_GAME_CATALOG_SUCCEEDED,
        }, () => {
            this.addCategoryBtns();
        }, this.$destroy);
        this.cdr.markForCheck();
    }

    protected async addCategoryBtns(): Promise<void> {
        await this.gamesCatalogService.ready;
        const categories: CategoryModel[] = this.gamesCatalogService.getCategoriesByMenu('main-menu');
        if (!categories) {
            return;
        }

        let menuItems: MenuParams.IMenuItem[] = MenuHelper.getItemsForCategories({
            categories: categories,
            lang: this.translate.currentLang,
            wlcElementPrefix: 'link_main-nav',
            icons: {
                folder: this.iconsFolder,
                disable: !this.useIcons,
            },
        });

        this.$params.menuParams.items = _sortBy(menuItems.concat(this.commonMenuItems as MenuParams.IMenuItem[]), (item) => item.sort);

        this.$params.menuParams = _clone(this.$params.menuParams);
        this.cdr.markForCheck();
    }
}
