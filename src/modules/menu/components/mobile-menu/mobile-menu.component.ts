import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
    ChangeDetectorRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import _clone from 'lodash-es/clone';
import _cloneDeep from 'lodash-es/cloneDeep';
import _has from 'lodash-es/has';
import _pull from 'lodash-es/pull';
import _filter from 'lodash-es/filter';
import _isObject from 'lodash-es/isObject';
import _findIndex from 'lodash-es/findIndex';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {
    IMenuOptions,
    IMenuItem,
} from 'wlc-engine/modules/core/system/interfaces/menu.interface';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {TIconExtension} from 'wlc-engine/modules/menu/system/interfaces/menu.interface';
import {MenuHelper} from 'wlc-engine/modules/menu/system/helpers/menu.helper';
import {MenuService} from 'wlc-engine/modules/menu/system/services/menu.service';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';

import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as Config from 'wlc-engine/modules/menu/system/config/mobile-menu.config';
import * as Params from './mobile-menu.params';

@Component({
    selector: '[wlc-mobile-menu]',
    templateUrl: './mobile-menu.component.html',
    styleUrls: ['./styles/mobile-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent extends AbstractComponent implements OnInit {

    public $params: Params.IMobileMenuCParams;
    public menuParams: MenuParams.IMenuCParams;

    protected menuConfig: MenuParams.MenuConfigItem[];
    protected menuSettings: IMenuOptions;
    protected isAuth: boolean;
    protected gamesCatalogService: GamesCatalogService;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMobileMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected translateService: TranslateService,
        protected eventService: EventService,
        protected injectionService: InjectionService,
        protected menuService: MenuService,
    ) {
        super(
            <IMixedParams<Params.IMobileMenuCParams>>{
                injectParams: injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.gamesCatalogService = await this.injectionService
            .getService<GamesCatalogService>('games.games-catalog-service');

        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.initEventHandlers();

        await this.initConfig();
        this.initMenu();
    }

    protected async initConfig(): Promise<void> {
        this.menuSettings = _cloneDeep(await this.menuService.getFundistMenuSettings('mobileMenu'));
        if (this.menuSettings) {

            const itemsBefore: IMenuItem[] = this.configService
                .get<IMenuItem[]>('$menu.mobileMenu.fundistMenuSettings.itemsBefore');
            if (itemsBefore) {
                this.menuSettings.items = itemsBefore.concat(this.menuSettings.items);
            }

            const itemsAfter: IMenuItem[] = this.configService
                .get<IMenuItem[]>('$menu.mobileMenu.fundistMenuSettings.itemsAfter');
            if (itemsAfter) {
                this.menuSettings.items = this.menuSettings.items.concat(itemsAfter);
            }

            this.menuConfig = MenuHelper
                .parseMenuSettings(this.menuSettings, 'mobile-menu', this.translateService.currentLang, {
                    isAuth: this.isAuth,
                    wlcElementPrefix: 'link_mobile-nav-',
                });
        } else {
            this.menuConfig = this.configService.get('$base.app.type') === 'kiosk'
                ? this.$params.kioskItems
                : this.configService.get<MenuParams.MenuConfigItem[]>('$menu.mobileMenu.items');
        }

        const useTournaments = this.configService.get<boolean>('$base.tournaments.use');
        if (!useTournaments) {
            this.menuConfig = _pull(this.menuConfig, 'mobile-menu:tournaments');
        }

    }

    protected initMenu(): void {
        this.menuParams = {
            type: 'mobile-menu',
            theme: this.$params.theme,
            themeMod: this.$params.themeMod,
            common: {
                icons: {
                    extension: this.configService.get<TIconExtension>('$menu.mobileMenu.icons.extension'),
                },
            },
        };

        const useIcons: boolean = _has(this.$params, 'common.icons.use')
            ? this.$params.common.icons.use
            : this.configService.get<boolean>('$menu.mobileMenu.icons.use');

        const iconsFolder: string = this.menuSettings?.iconsPack ||
            this.$params.common?.icons?.folder ||
            this.configService.get<string>('$menu.mobileMenu.icons.folder');

        this.menuParams.items = MenuHelper.parseMenuConfig(this.menuConfig, Config.wlcMobileMenuItemsGlobal, {
            icons: {
                folder: iconsFolder,
                disable: !useIcons,
            },
        });

        const categoriesDropdownIndex: number = _findIndex(this.menuSettings?.items, (item: IMenuItem): boolean => {
            return item.id === 'game-categories';
        });

        if (categoriesDropdownIndex) {
            this.menuParams.items[categoriesDropdownIndex] = MenuHelper.parseMenuConfig(
                [this.menuConfig[categoriesDropdownIndex]],
                Config.wlcMobileMenuItemsGlobal,
                {
                    icons: {
                        folder: this.configService.get<string>('$menu.mobileMenu.categoryIcons.folder'),
                        disable: !this.configService.get<boolean>('$menu.mobileMenu.categoryIcons.use'),
                        fallback: 'plug',
                    },
                },
            )[0];
        }

        if (this.configService.get<boolean>('$menu.mobileMenu.disableCategories')) {
            this.menuParams.items = _filter(this.menuParams.items, (item): boolean => {
                return !(_isObject(item) && item.type === 'categories');
            });
        } else {
            MenuHelper.configureCategories(this.menuParams.items, {
                type: 'dropdown',
                theme: 'dropdown',
                themeMod: 'vertical',
                common: {
                    icons: {
                        folder: this.configService.get<string>('$menu.mobileMenu.categoryIcons.folder'),
                        use: this.configService.get<boolean>('$menu.mobileMenu.categoryIcons.use'),
                        extension: this.configService.get<TIconExtension>('$menu.mobileMenu.categoryIcons.extension'),
                    },
                },
            });
        }

        this.menuParams = _clone(this.menuParams);
        this.cdr.detectChanges();
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
