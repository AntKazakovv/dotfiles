import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector,
    OnInit,
} from '@angular/core';

import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as Params from 'wlc-engine/modules/menu/components/main-menu/main-menu.params';
import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    LayoutService,
    EventService,
} from 'wlc-engine/modules/core/system/services';
import {gamesEvents} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {MenuHelper} from 'wlc-engine/modules/menu/system/helpers/menu.helper';
import {TranslateService} from '@ngx-translate/core';
import {ConfigService} from 'wlc-engine/modules/core';
import * as Config from 'wlc-engine/modules/menu/system/config/main-menu.items.config';

import {
    clone as _clone,
} from 'lodash';

@Component({
    selector: '[wlc-main-menu]',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./styles/main-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent extends AbstractComponent implements OnInit {
    public items: MenuParams.IMenuItem[];
    public $params: Params.IMainMenuCParams;
    public menuParams: MenuParams.IMenuCParams = {
        type: 'main-menu',
        items: [],
    };
    public commonMenuItems: MenuParams.MenuItemType[];

    protected menuConfig: MenuParams.MenuConfigItem[];

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
        );
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.initConfig();
        this.initMenu();
    }

    protected initConfig(): void {
        const configMenu = this.configService.get<MenuParams.MenuConfigItem[]>('$base.mainMenu');
        this.menuConfig = configMenu || Config.wlcMainMenuItemsDefault;
    }

    protected initMenu(): void {
        this.menuParams = {
            type: 'main-menu',
            wlcElement: this.$params.wlcElement || 'wlc-main-menu',
        };
        this.commonMenuItems = MenuHelper.parseMenuConfig(this.menuConfig, Config.wlcMainMenuItemsGlobal);
        this.menuParams.items = this.commonMenuItems;
        this.menuParams = _clone(this.menuParams);

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

    protected addCategoryBtns(): void {
        const categories: CategoryModel[] = this.gamesCatalogService.getCategoriesByMenu('main-menu');
        if (!categories) {
            return;
        }

        const menuItems: MenuParams.IMenuItem[] = MenuHelper.getItemsForCategories({
            categories: categories,
            lang: this.translate.currentLang,
        });
        this.menuParams.items = menuItems.concat(this.commonMenuItems as MenuParams.IMenuItem[]);
        this.menuParams = _clone(this.menuParams);
        this.cdr.markForCheck();
    }
}
