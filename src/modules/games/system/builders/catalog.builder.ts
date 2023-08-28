import {TranslateService} from '@ngx-translate/core';
import {UIRouter} from '@uirouter/core';

import {
    ConfigService,
    EventService,
    HooksService,
    IIndexing,
    InjectionService,
} from 'wlc-engine/modules/core';
import {IAllSortsItemResponse} from 'wlc-engine/modules/games/system/interfaces/sorts.interfaces';
import {Catalog} from 'wlc-engine/modules/games/system/classes/catalog';
import {CategoriesBuilder} from 'wlc-engine/modules/games/system/builders/categories.builder';
import {GamesBuilder} from 'wlc-engine/modules/games/system/builders/games.builder';
import {MerchantsBuilder} from 'wlc-engine/modules/games/system/builders/merchants.builder';
import {IGames} from 'wlc-engine/modules/games/system/interfaces';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services';

/**
 * This builder configures the catalog. Which includes games, categories, merchants
 */
export class CatalogBuilder {

    private categoriesBuilder?: CategoriesBuilder;
    private gamesBuilder?: GamesBuilder;
    private merchantsBuilder?: MerchantsBuilder;

    public categories(categoriesBuilder: CategoriesBuilder): this {
        if (this.categoriesBuilder) {
            const categoriesBuilderWithProject = {...this.categoriesBuilder.settings, ...categoriesBuilder.settings};
            this.categoriesBuilder = new CategoriesBuilder();
            this.categoriesBuilder.settings = categoriesBuilderWithProject;
            return this;
        }

        this.categoriesBuilder = categoriesBuilder;
        return this;
    }

    public games(settings: GamesBuilder): this {
        this.gamesBuilder = settings;
        return this;
    }

    public merchants(settings: MerchantsBuilder): this {
        this.merchantsBuilder = settings;
        return this;
    }

    public build(
        gamesRequestInfo: IGames,
        gamesCatalogService: GamesCatalogService,
        translateService: TranslateService,
        configService: ConfigService,
        router: UIRouter,
        eventService: EventService,
        injectionService: InjectionService,
        hooksService: HooksService,
        sorts?: IIndexing<IAllSortsItemResponse>,
    ) {
        const merchants = this.merchantsBuilder
            ? this.merchantsBuilder.build(configService, translateService)
            : new MerchantsBuilder().build(configService, translateService);

        const games = this.gamesBuilder
            ? this.gamesBuilder.build(configService, translateService, sorts)
            : new GamesBuilder().build(configService, translateService, sorts);

        const categories = this.categoriesBuilder
            ? this.categoriesBuilder.build(configService, translateService)
            : new CategoriesBuilder().build(configService, translateService);

        return new Catalog(
            gamesRequestInfo,
            gamesCatalogService,
            translateService,
            configService,
            router,
            eventService,
            injectionService,
            hooksService,
            categories,
            merchants,
            games,
            sorts,
        );
    }
}
