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
    has as _has,
} from 'lodash-es';

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
    }

    protected initMenu(): void {
        this.useIcons = _has(this.$params, 'common.icons.use')
            ? this.$params.common.icons.use
            : this.configService.get<boolean>('$menu.mainMenu.icons.use');

        this.iconsFolder = this.$params.common?.icons?.folder || this.configService.get<string>('$menu.mainMenu.icons.folder');

        this.menuParams = {
            type: 'main-menu',
            wlcElement: this.$params.wlcElement || 'wlc-main-menu',
        };
        this.commonMenuItems = MenuHelper.parseMenuConfig(this.menuConfig, Config.wlcMainMenuItemsGlobal, {
            icons: {
                folder: this.iconsFolder,
                disable: !this.useIcons,
            },
        });
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

    protected async addCategoryBtns(): Promise<void> {
        await this.gamesCatalogService.ready;
        const categories: CategoryModel[] = this.gamesCatalogService.getCategoriesByMenu('main-menu');
        if (!categories) {
            return;
        }

        const menuItems: MenuParams.IMenuItem[] = MenuHelper.getItemsForCategories({
            categories: categories,
            lang: this.translate.currentLang,
            icons: {
                folder: this.iconsFolder,
                disable: !this.useIcons,
            },
        });
        this.menuParams.items = menuItems.concat(this.commonMenuItems as MenuParams.IMenuItem[]);
        this.menuParams = _clone(this.menuParams);
        this.cdr.markForCheck();
    }
}
