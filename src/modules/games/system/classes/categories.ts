import {
    LangChangeEvent,
    TranslateService,
} from '@ngx-translate/core';

import _forEach from 'lodash-es/forEach';
import _filter from 'lodash-es/filter';
import _orderBy from 'lodash-es/orderBy';
import _find from 'lodash-es/find';
import _isString from 'lodash-es/isString';
import _includes from 'lodash-es/includes';

import {
    AppType,
    ConfigService,
    ICategorySettings,
    IIndexing,
} from 'wlc-engine/modules/core';
import {
    categorySettings as defaultCategorySettings,
} from 'wlc-engine/modules/games/system/config/fundist-category-settings.config';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {
    ICategoriesSettings,
    IPrepareCategoriesListOptions,
    ISetGamesForCategoriesOptions,
} from 'wlc-engine/modules/games/system/builders/categories.builder';
import {
    ICategory,
    IExcludeCategories,
    IHideCategories,
    ISortCategories,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';

export class Categories {

    public renamedSlugs: IIndexing<string> = {};
    public categorySettings: IIndexing<ICategorySettings>;
    public projectCategories: CategoryModel[] = [];
    public hideSettings: ICategoriesSettings['hide'];
    public sortSettings: ICategoriesSettings['sortValues'];
    public exclude: ICategoriesSettings['exclude'];
    public parentCategories: ICategoriesSettings['parentCategories'];
    public architectureVersion: ICategoriesSettings['architectureVersion'] = 1;
    public defaultCategoryArchitecture: boolean = true;

    public allCategories: CategoryModel[] = [];
    public availableCategories: CategoryModel[];
    public defaultSpecialCategories: string[] = [
        'casino',
        'lastplayed',
        'favourites',
        'last-played',
    ];
    public defaultParentCategories: string[] = [
        'new',
        'popular',
    ];
    public specialCategories: ICategory[] = [
        {
            ID: '-1',
            Name: {
                en: gettext('Last played'),
            },
            Trans: {
                en: gettext('Last played'),
            },
            Tags: [],
            menuId: 'lastplayed',
            Slug: 'lastplayed',
            CSort: '0',
            CSubSort: '9999998',
        },
        {
            ID: '-2',
            Name: {
                en: gettext('My favourites'),
            },
            Trans: {
                en: gettext('My favourites'),
            },
            Tags: [],
            menuId: 'favourites',
            Slug: 'favourites',
            CSort: '0',
            CSubSort: '9999999',
        },
        {
            ID: '-3',
            Name: {
                en: gettext('Casino'),
            },
            Trans: {
                en: gettext('Casino'),
            },
            Tags: [''],
            menuId: 'casino',
            Slug: 'casino',
            CSort: '0',
            CSubSort: '0',
        },
    ];

    constructor(
        protected settings: ICategoriesSettings,
        protected configService: ConfigService,
        protected translateService: TranslateService,
    ) {
        this.init();
    }

    public transformSlug(slug: string): string {
        return this.renamedSlugs[slug] ?? slug;
    }

    public transformSlugs(slug: string[]): string[] {
        return slug.map((item) => {
            return this.transformSlug(item);
        });
    }

    public getCategoriesBySlugs(slugs: string[], onlyAvailable: boolean = false): CategoryModel[] {
        const categories: CategoryModel[] = onlyAvailable ? this.availableCategories : this.projectCategories;

        if (this.renamedSlugs) {
            slugs = this.transformSlugs(slugs);
        }

        return _filter(categories, (category: CategoryModel): boolean => {
            return _includes(slugs, category.slug);
        });
    }

    /**
     * Get available category by slug or by slugs array
     *
     * @param {string | string[]} slug
     * @returns {CategoryModel}
     */
    public getCategoryBySlug(slug: string | string[], byDefaultCategories?: boolean): CategoryModel {

        if (!slug) {
            return;
        }

        if (this.renamedSlugs) {
            slug = _isString(slug)
                ? this.transformSlug(slug)
                : this.transformSlugs(slug);
        }

        const slugs: string[] = _isString(slug) ? [slug] : slug;
        const categoryList = byDefaultCategories ? this.allCategories : this.availableCategories;
        for (const categorySlug of slugs) {
            const category = _find(categoryList, (category: CategoryModel) => {
                return category.slug === categorySlug;
            });
            if (category) {
                return category;
            }
        }
    }

    /**
     * Sort categories
     *
     * @param {CategoryModel[]} categories Category list
     * @returns {CategoryModel[]} Sorted category list
     */
    public sortCategories(categories: CategoryModel[]): CategoryModel[] {
        if (this.settings.sortFn) {
            return this.settings.sortFn(categories);
        }

        return _orderBy(
            categories,
            [
                (category: CategoryModel) => {
                    return category.primarySort || null;
                },
                (category: CategoryModel) => category.sortByLang || null,
                (category: CategoryModel) => category.operatorSort || 0,
                (category: CategoryModel) => category.globalSort || 0,
            ],
            [
                'asc',
                'asc',
                'desc',
                'desc',
            ],
        );
    }

    public prepareCategoriesList(options: IPrepareCategoriesListOptions): CategoryModel[] {
        return this.settings.prepareCategoriesList(options);
    }

    public setGamesForCategories(options: ISetGamesForCategoriesOptions): void {
        return this.settings.setGamesForCategories(options);
    }

    protected init(): void {
        this.renamedSlugs = this.settings.transformSlugs || this.configService.get('$games.categories.renameSlugs');

        if (this.renamedSlugs) {
            this.defaultSpecialCategories = this.transformSlugs(this.defaultSpecialCategories);
            this.defaultParentCategories = this.transformSlugs(this.defaultParentCategories);
        }

        this.categorySettings = this.configService.get('appConfig.categories');

        if (!this.categorySettings && this.configService.get('$games.fundist.defaultCategorySettings.use')) {
            this.categorySettings = defaultCategorySettings;
        }

        this.translateService.onLangChange.subscribe(({lang}: LangChangeEvent) => {
            if (CategoryModel.language !== lang) {
                CategoryModel.language = lang;

                _forEach(this.projectCategories, (category) => {
                    category.sortGames();

                    _forEach(category.childCategories, (childCategory) => {
                        childCategory.sortGames();
                    });
                });
            }
        });

        if (this.configService.get<AppType>('$base.app.type') === 'kiosk') {
            this.specialCategories = _filter(this.specialCategories, (category: ICategory) => {
                return category.Slug !== 'lastplayed' && category.Slug !== 'favourites';
            });
        }

        this.hideSettings = this.settings.hide || this.configService.get<IHideCategories>('$games.categories.hide');
        this.sortSettings = this.settings.sortValues
            || this.configService.get<ISortCategories>('$games.categories.sort')?.byDefault;

        this.exclude = this.settings.exclude || this.configService.get<IExcludeCategories>('$games.categories.exclude');

        this.parentCategories = this.settings.parentCategories
            || this.configService.get<string[]>('$games.categories.parents') || [];

        this.architectureVersion= this.settings.architectureVersion;
    }
}
