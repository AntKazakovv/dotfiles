import {
    Injectable,
} from '@angular/core';

import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {
    IMenu,
    IMenuOptions,
    IMenuItem,
} from 'wlc-engine/modules/core/system/interfaces/menu.interface';

import _forEach from 'lodash-es/forEach';
import _reduce from 'lodash-es/reduce';
import _cloneDeep from 'lodash-es/cloneDeep';

@Injectable({
    providedIn: 'root',
})
export class MenuService {

    private menuSettings: IMenu;
    private loadFailed: boolean = false;
    private gamesCatalogService: GamesCatalogService;

    constructor(
        protected configService: ConfigService,
        protected injectionService: InjectionService,
    ) {

    }

    /**
     * Check exist fundist menu settings
     *
     * @returns {Promise<boolean>}
     */
    public async existFundistMenuSettings(): Promise<boolean> {
        await this.loadFundistMenuSettings();
        return !!this.menuSettings;
    }

    /**
     * Get fundist settings for some menu
     *
     * @param {string} menuId
     * @returns {Promise<IMenuOptions>}
     */
    public async getFundistMenuSettings(menuId: string): Promise<IMenuOptions> {
        await this.loadFundistMenuSettings();
        return this.menuSettings?.[menuId];
    }

    /**
     * Load fundist menu settings
     *
     * @returns {Promise<void>}
     */
    private async loadFundistMenuSettings(): Promise<void> {
        await this.configService.ready;

        if (!this.menuSettings && !this.loadFailed) {
            this.menuSettings = _cloneDeep(this.configService.get('appConfig.menuSettings'));

            if (!this.menuSettings && this.configService.get('$menu.fundist.defaultMenuSettings.use')) {
                try {
                    this.menuSettings =
                        (await import('wlc-engine/modules/menu/system/config/fundist-menu-settings.config'))
                            .fundistSettings;
                } catch (err) {
                    this.loadFailed = true;
                }
            }

            if (this.menuSettings) {

                if (!this.gamesCatalogService) {
                    this.gamesCatalogService = await this.injectionService
                        .getService<GamesCatalogService>('games.games-catalog-service');
                }

                this.gamesCatalogService.ready.then(() => {
                    _forEach(this.menuSettings, (settings: IMenuOptions) => {
                        settings.items = this.prepareMenuItems(settings.items);
                    });
                });
            }
        }
    }

    /**
     * Prepare menu items
     *
     * @param {IMenuItem[]} items
     */
    private prepareMenuItems(items: IMenuItem[]) {
        return _reduce(items, (items: IMenuItem[], item: IMenuItem) => {
            if (item.type === 'dropdown') {
                item.items = this.prepareMenuItems(item.items);
            } else if (item.type === 'category') {
                const category: CategoryModel = this.gamesCatalogService.getCategoryBySlug(item.id);
                if (!category) {
                    return items;
                }
                item.name = category.title;
            }

            items.push(item);
            return items;
        }, []);
    }
}
