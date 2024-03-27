import {
    Injectable,
} from '@angular/core';

import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {StaticService} from 'wlc-engine/modules/static';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {TextDataModel} from 'wlc-engine/modules/static/system/models/textdata.model';
import {
    IMenu,
    IMenuOptions,
    IMenuItem,
    IPostDataOptions,
} from 'wlc-engine/modules/core/system/interfaces/menu.interface';

import _forEach from 'lodash-es/forEach';
import _reduce from 'lodash-es/reduce';
import _cloneDeep from 'lodash-es/cloneDeep';
import _includes from 'lodash-es/includes';
import _filter from 'lodash-es/filter';
import _map from 'lodash-es/map';

@Injectable({
    providedIn: 'root',
})
export class MenuService {

    private menuSettings: IMenu;
    private menuSettingPrepared: boolean = false;
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
    public async getFundistMenuSettings(menuId: keyof IMenu): Promise<IMenuOptions> {
        await this.loadFundistMenuSettings();

        if (!this.menuSettingPrepared && this.menuSettings) {

            if (!this.gamesCatalogService) {
                this.gamesCatalogService = await this.injectionService
                    .getService<GamesCatalogService>('games.games-catalog-service');
            }
            await this.gamesCatalogService.ready;

            _forEach(this.menuSettings, (settings: IMenuOptions) => {
                settings.items = this.prepareMenuItems(settings.items);
            });
            this.menuSettingPrepared = true;
        }

        return this.menuSettings?.[menuId];
    }

    /**
     * Get wordpress posts data by category slugs from component settings
     *
     * @returns {Promise<TextDataModel[][]>}
     */
    public async getWpPosts(options: IPostDataOptions): Promise<TextDataModel[][]> {
        const staticService = await this.injectionService
            .getService<StaticService>('static.static-service');
        const {categorySlug, exclude} = options;
        let posts: TextDataModel[][] = [];

        if (Array.isArray(categorySlug)) {
            const requests = _map(categorySlug, (slug) => {
                return staticService.getPostsListByCategorySlug(slug);
            });

            posts = _filter(await Promise.all(requests), ({length}) => !!length);
        } else {
            posts = [await staticService.getPostsListByCategorySlug(categorySlug)];
        }

        if (exclude) {
            posts = _map<TextDataModel[], TextDataModel[]>(posts, (models) => (
                _filter<TextDataModel>(models, (model) => !_includes(exclude, model.slug))
            ));
        }
        return posts;
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
        }
    }

    /**
     * Prepare menu items
     *
     * @param {IMenuItem[]} items
     */
    private prepareMenuItems(items: IMenuItem[]): IMenuItem[] {
        return _reduce(items, (items: IMenuItem[], item: IMenuItem) => {
            if (item.type === 'dropdown') {
                item.items = this.prepareMenuItems(item.items);
            } else if (item.type === 'category' || (item.type === 'page' && item.id === 'recommendations')) {
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
