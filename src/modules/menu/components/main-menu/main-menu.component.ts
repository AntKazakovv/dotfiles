import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {
    TranslateService,
} from '@ngx-translate/core';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

import {
    BehaviorSubject,
} from 'rxjs';
import {
    takeUntil,
} from 'rxjs/operators';
import _set from 'lodash-es/set';
import _clone from 'lodash-es/clone';
import _has from 'lodash-es/has';
import _sortBy from 'lodash-es/sortBy';
import _merge from 'lodash-es/merge';
import _pull from 'lodash-es/pull';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {LayoutService} from 'wlc-engine/modules/core/system/services/layout/layout.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {IMenuOptions} from 'wlc-engine/modules/core/system/interfaces/menu.interface';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {AppType} from 'wlc-engine/modules/core';

import {gamesEvents} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {MenuService} from 'wlc-engine/modules/menu/system/services/menu.service';
import {
    TFixedPanelState,
    TFixedPanelStore,
} from 'wlc-engine/modules/core/system/interfaces/base-config/fixed-panel.interface';
import {MenuHelper} from 'wlc-engine/modules/menu/system/helpers/menu.helper';
import {TIconExtension} from 'wlc-engine/modules/menu/system/interfaces/menu.interface';

import * as Config from 'wlc-engine/modules/menu/system/config/main-menu.items.config';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as Params from 'wlc-engine/modules/menu/components/main-menu/main-menu.params';

@Component({
    selector: '[wlc-main-menu]',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./styles/main-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent extends AbstractComponent implements OnInit {
    public items: MenuParams.IMenuItem[];
    public override $params: Params.IMainMenuCParams;
    public commonMenuItems: MenuParams.MenuItemType[];

    protected menuConfig: MenuParams.MenuConfigItem[];
    protected useIcons: boolean;
    protected iconsFolder: string;
    protected menuSettings: IMenuOptions;
    protected isAuth: boolean;
    protected gamesCatalogService: GamesCatalogService;
    protected fixedPanelStore$: BehaviorSubject<TFixedPanelStore>;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMainMenuCParams,
        cdr: ChangeDetectorRef,
        protected layoutService: LayoutService,
        protected translate: TranslateService,
        protected eventService: EventService,
        configService: ConfigService,
        protected injectionService: InjectionService,
        protected menuService: MenuService,
    ) {
        super(
            <IMixedParams<Params.IMainMenuCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
            cdr,
        );
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.gamesCatalogService = await this.injectionService.getService('games.games-catalog-service');

        this.initMenuParams();

        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.initEventHandlers();

        await this.initConfig();
        this.initMenu();
    }

    protected async initConfig(): Promise<void> {
        this.menuSettings = this.$params.type === 'burger-menu'
            ? await this.menuService.getFundistMenuSettings('burgerMenu')
            : await this.menuService.getFundistMenuSettings('mainMenu');

        if (this.menuSettings) {
            this.menuConfig = MenuHelper.parseMenuSettings(this.menuSettings, 'main-menu', this.translate.currentLang, {
                isAuth: this.isAuth,
                wlcElementPrefix: 'link_main-nav-',
            });
        } else if (this.configService.get<AppType>('$base.app.type') === 'kiosk') {
            this.menuConfig = this.configService.get<MenuParams.MenuConfigItem[]>('$menu.mainMenuKiosk.items');
        } else {
            this.menuConfig = this.configService.get<MenuParams.MenuConfigItem[]>('$menu.mainMenu.items');
        }

        const useTournaments = this.configService.get<boolean>('$base.tournaments.use');
        if (!useTournaments) {
            this.menuConfig = _pull(this.menuConfig, 'main-menu:tournaments');
        }
        this.menuConfig = _pull(
            this.menuConfig,
            this.configService.get('$base.contacts.separatedPage') ? 'main-menu:contacts' : 'main-menu:contact-us',
        );
    }

    protected initMenu(): void {
        if (this.$params.menuParams.common.useSwiper) {
            this.addModifiers('swiper');
        }

        this.useIcons = _has(this.$params, 'common.icons.use')
            ? this.$params.common.icons.use
            : this.configService.get<boolean>('$menu.mainMenu.icons.use');

        this.iconsFolder = this.menuSettings?.iconsPack
            || this.$params.common?.icons?.folder
            || this.configService.get<string>('$menu.mainMenu.icons.folder');

        const extension: TIconExtension = this.configService.get<TIconExtension>('$menu.mainMenu.icons.extension');
        if (extension) {
            _set(this.$params, 'menuParams.common.icons.extension', extension);
        }

        _merge(this.$params.menuParams, {
            wlcElement: this.$params.wlcElement || 'wlc-main-menu',
        });

        this.commonMenuItems = MenuHelper.parseMenuConfig(this.menuConfig, Config.wlcMainMenuItemsGlobal, {
            icons: {
                folder: this.iconsFolder,
                disable: !this.useIcons,
            },
        });

        if (this.$params.themeMod === 'fixed-burger') {
            this.initFixedMenu();
        }

        this.$params.menuParams.items = this.commonMenuItems;
        this.$params.menuParams = _clone(this.$params.menuParams);

        if (!this.menuSettings) {
            if (this.gamesCatalogService.getGameList()) {
                this.addCategoryBtns();
            }

            this.eventService.subscribe({
                name: gamesEvents.FETCH_GAME_CATALOG_SUCCEEDED,
            }, () => {
                this.addCategoryBtns();
            }, this.$destroy);
        }

        this.cdr.markForCheck();
    }

    protected initFixedMenu(): void {
        this.fixedPanelStore$ = this.configService.get<BehaviorSubject<TFixedPanelStore>>('fixedPanelStore$');

        this.fixedPanelStore$
            .pipe(
                takeUntil(this.$destroy),
            )
            .subscribe((store: TFixedPanelStore) => {
                const state: TFixedPanelState = store[this.$params.fixedPanelPosition];
                this.$params.menuParams.tooltip.use = state === 'compact';
                this.$params.menuParams = _clone(this.$params.menuParams);
                this.cdr.markForCheck();
            });
    }

    protected initMenuParams(): void {
        if (this.$params.common) {
            _merge(this.$params.menuParams, {
                sliderParams: {
                    swiper: {
                        navigation: {
                            nextEl: '.wlc-main-menu__control--next',
                            prevEl: '.wlc-main-menu__control--prev',
                        },
                    },
                },
            });
        }
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

        this.$params.menuParams.items = _sortBy(
            menuItems.concat(this.commonMenuItems as MenuParams.IMenuItem[]),
            (item) => item.sort,
        );

        this.$params.menuParams = _clone(this.$params.menuParams);
        this.cdr.markForCheck();
    }

    /**
     * Init event handlers
     */
    protected initEventHandlers(): void {
        this.eventService.subscribe({
            name: 'LOGOUT',
        }, () => {
            this.isAuth = false;
        }, this.$destroy);

        this.eventService.subscribe({
            name: 'LOGIN',
        }, () => {
            this.isAuth = true;
        }, this.$destroy);
    }
}
