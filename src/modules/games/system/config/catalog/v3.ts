import _filter from 'lodash-es/filter';
import _forEach from 'lodash-es/forEach';
import _includes from 'lodash-es/includes';
import _cloneDeep from 'lodash-es/cloneDeep';
import _union from 'lodash-es/union';

import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {CatalogBuilder} from 'wlc-engine/modules/games/system/builders/catalog.builder';
import {
    CategoriesBuilder,
    IPrepareCategoriesListOptions,
    ISetGamesForCategoriesOptions,
} from 'wlc-engine/modules/games/system/builders/categories.builder';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';

/**
 * This category architecture implies 2 parent categories: casino, livecasino.
 * Between which all child categories are distributed.
 * In this architecture, games are categorized into parent categories.
 * Two drop-down lists are created in the mobile menu: casino, livecasino.
 *
 * The project should have the following settings
 * @example
 *
 * export const $games: IGamesConfig = {
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
 *      catalogBuilder: catalogArch3
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
export const catalogArch3 = new CatalogBuilder()
    .categories(
        new CategoriesBuilder()
            .setArchitectureVersion(3)
            .prepareCategoriesList((options: IPrepareCategoriesListOptions): CategoryModel[] => {
                const parentCategories: CategoryModel[] =
                    _filter(options.allCategories, (category: CategoryModel) => {
                        return category.isParent && _includes(['casino', 'livecasino'], category.slug);
                    });

                const livecasinoCategory: CategoryModel =
                    options.getCategoryBySlug(['livecasino'], true);

                const childCategories: CategoryModel[] =
                    _filter(options.allCategories, (category: CategoryModel) => {
                        return !category.isParent
                            || category.isLastPlayed
                            || category.isFavourites
                            || category.isPopular
                            || category.isNew;
                    });

                const availableChildCategories: CategoryModel[] = [];
                const hiddenCategories: CategoryModel[] = [];

                _forEach(parentCategories, (parentCategory: CategoryModel): void => {

                    const currentChildCategories = [];

                    _forEach(childCategories, (category: CategoryModel): void => {
                        if (category.isHidden) {
                            const newChildCategory: CategoryModel = _cloneDeep(category);

                            const games = _filter(options.availableGames, (game: Game) => {
                                if (parentCategory.slug === 'casino') {
                                    return _includes(game.categoryID, category.id)
                                        && !_includes(game.categoryID, livecasinoCategory?.id);
                                } else {
                                    return _includes(game.categoryID, category.id)
                                        && _includes(game.categoryID, parentCategory.id);
                                }
                            });

                            if (games.length) {
                                newChildCategory.setGames(games);
                            }

                            hiddenCategories.push(newChildCategory);
                            return;
                        }

                        if (category.isFavourites || category.isLastPlayed) {
                            const newChildCategory: CategoryModel = _cloneDeep(category);
                            newChildCategory.setParentCategory(parentCategory);
                            availableChildCategories.push(newChildCategory);
                            currentChildCategories.push(newChildCategory);
                            return;
                        }

                        const games = _filter(options.availableGames, (game: Game) => {
                            if (parentCategory.slug === 'casino') {
                                return _includes(game.categoryID, category.id)
                                    && !_includes(game.categoryID, livecasinoCategory?.id);
                            } else {
                                return _includes(game.categoryID, category.id)
                                    && _includes(game.categoryID, parentCategory.id);
                            }
                        });

                        if (games.length) {
                            const newChildCategory: CategoryModel = _cloneDeep(category);
                            newChildCategory.setParentCategory(parentCategory);
                            newChildCategory.setGames(games);
                            availableChildCategories.push(newChildCategory);
                            currentChildCategories.push(newChildCategory);
                        }
                    });

                    parentCategory.setChildCategories(currentChildCategories);
                });

                return _union(
                    parentCategories,
                    availableChildCategories,
                    hiddenCategories,
                );
            })
            .setGamesForCategories((
                options: ISetGamesForCategoriesOptions,
            ): void => {
                _forEach(options.categories, (mainCategory): void => {
                    let games: Game[] = [];

                    if (!mainCategory.isParent) {
                        return;
                    }
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
                });
            }),
    );
