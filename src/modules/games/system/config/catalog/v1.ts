import _filter from 'lodash-es/filter';
import _forEach from 'lodash-es/forEach';
import _find from 'lodash-es/find';
import _includes from 'lodash-es/includes';
import _cloneDeep from 'lodash-es/cloneDeep';
import _union from 'lodash-es/union';
import _get from 'lodash-es/get';
import _reduce from 'lodash-es/reduce';
import _isEmpty from 'lodash-es/isEmpty';

import {CatalogBuilder} from 'wlc-engine/modules/games/system/builders/catalog.builder';
import {
    CategoriesBuilder,
    IPrepareCategoriesListOptions,
    ISetGamesForCategoriesOptions,
} from 'wlc-engine/modules/games/system/builders/categories.builder';
import {
    CategoryModel,
    Game,
} from 'wlc-engine/modules/games/system/models';
import {IGameBlock} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';

/**
 * This category architecture implies that all settings for categories and menus come from the fundist.
 *
 * This architecture is default
 *
 * The project should have the following settings
 *
 * @example
 *
 *  export const $games: IGamesConfig = {
 *      fundist: {
 *          defaultCategorySettings: {
 *              use: false,
 *          },
 *      },
 *  };
 *
 * export const $menu: IMenuConfig = {
 *      fundist: {
 *          defaultMenuSettings: {
 *              use: false,
 *          },
 *      },
 * };
 *
 * This architecture can be modified in the project config
 * @example
 *
 * export const $games: IGamesConfig = {
 *      catalogBuilder: catalogArch1
 *          .categories(
 *              new CategoriesBuilder()
 *                  .setGamesForCategories((
 *                      options: ISetGamesForCategoriesOptions,
 *                  ): void => {
 *                  let games: Game[] = [];
 *                      .......
 *                      further customization
 *                  })
 *          ),
 *      }
 */
export const catalogArch1 = new CatalogBuilder()
    .categories(
        new CategoriesBuilder()
            .setArchitectureVersion(1)
            .prepareCategoriesList((options: IPrepareCategoriesListOptions): CategoryModel[] => {
                const parentCategories: CategoryModel[] =
                    _filter(options.allCategories, (category: CategoryModel) => category.isParent);

                const mainParentCategory: CategoryModel =
                    options.getCategoryBySlug(['casino', 'livecasino', 'tablegames'], true);

                const childCategories: CategoryModel[] =
                    _filter(options.allCategories, (category: CategoryModel) => !category.isParent);

                const availableChildCategories: CategoryModel[] = [];
                const hiddenCategories: CategoryModel[] = [];

                _forEach(childCategories, (category: CategoryModel): void => {
                    if (category.isHidden) {
                        hiddenCategories.push(category);
                        return;
                    }

                    const hasGames = !!_find(options.availableGames, (game: Game) => {
                        return _includes(game.categoryID, category.id);
                    });

                    if (hasGames) {
                        const newChildCategory: CategoryModel = _cloneDeep(category);
                        newChildCategory.setParentCategory(mainParentCategory);
                        availableChildCategories.push(newChildCategory);
                    }
                });

                mainParentCategory.setChildCategories(availableChildCategories);

                return _union(
                    parentCategories,
                    availableChildCategories,
                    hiddenCategories,
                );
            })
            .setGamesForCategories((options: ISetGamesForCategoriesOptions): void => {
                _forEach(options.categories, (mainCategory): void => {
                    const settings = _get(options.categorySettings, mainCategory.slug);
                    if (settings) {
                        const games: Game[] = options.filterGames([mainCategory]);
                        mainCategory.setGames(games);

                        if (settings.view === 'blocks' || settings.view === 'restricted-blocks') {
                            const gameBlocks: IGameBlock[] =
                                _reduce(options.categories, (blocks: IGameBlock[], category: CategoryModel) => {

                                    const skipCategory: boolean = !_isEmpty(settings.blocks)
                                        && !settings.blocks[category.slug];

                                    if (!skipCategory && category.slug !== mainCategory.slug) {

                                        if (!category.games.length) {
                                            category.setGames(options.filterGames([category]));
                                        }

                                        const games: Game[] = mainCategory.slug === 'casino'
                                            ? category.games
                                            : category.gamesWithCategory(mainCategory);

                                        if (games.length) {
                                            blocks.push({
                                                category: category,
                                                games: games,
                                                settings: _get(settings, `blocks.${category.slug}`),
                                            });
                                        }
                                    }
                                    return blocks;
                                }, []);

                            mainCategory.setGameBlocks(gameBlocks);
                        }
                    } else {
                        let games: Game[] = [];

                        if (mainCategory.slug === 'casino') {
                            games = options.getGameList({
                                excludeCategories: ['livecasino'],
                            });
                        } else {
                            games = options.filterGames([mainCategory]);
                        }

                        if (games.length) {
                            mainCategory.setGames(games);
                        }
                    }
                });
            }),
    );
