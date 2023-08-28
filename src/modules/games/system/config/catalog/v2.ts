import _filter from 'lodash-es/filter';
import _forEach from 'lodash-es/forEach';
import _get from 'lodash-es/get';
import _reduce from 'lodash-es/reduce';
import _isEmpty from 'lodash-es/isEmpty';

import {CatalogBuilder} from 'wlc-engine/modules/games/system/builders/catalog.builder';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {IGameBlock} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {
    CategoriesBuilder,
    IPrepareCategoriesListOptions,
    ISetGamesForCategoriesOptions,
} from 'wlc-engine/modules/games/system/builders/categories.builder';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';

/**
 * This category architecture implies setting menus and categories via json
 *
 * The project should have the following settings
 *
 * @example
 *
 *  export const $games: IGamesConfig = {
 *      fundist: {
 *          defaultCategorySettings: {
 *              use: true,
 *          },
 *      },
 *  };
 *
 * export const $menu: IMenuConfig = {
 *      fundist: {
 *          defaultMenuSettings: {
 *              use: true,
 *          },
 *      },
 * };
 * This architecture can be modified in the project config
 * @example
 *
 * export const $games: IGamesConfig = {
 *      catalogBuilder: catalogArch2
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
export const catalogArch2 = new CatalogBuilder()
    .categories(
        new CategoriesBuilder()
            .setArchitectureVersion(2)
            .prepareCategoriesList((options: IPrepareCategoriesListOptions): CategoryModel[] => {
                return _filter(options.allCategories, (category: CategoryModel) => {
                    if (!!options.categorySettings[category.slug] || category.isSpecial) {
                        category.setAsParent();
                        return true;
                    }
                    return false;
                });
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
