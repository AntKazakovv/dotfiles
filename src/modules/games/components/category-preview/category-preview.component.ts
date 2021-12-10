import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ConfigService, GlobalHelper, IIndexing} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import * as Params from './category-preview.params';

import _includes from 'lodash-es/includes';

interface ICategory {
    state: string;
    stateParams: IIndexing<string>;
    slug: string;
    game: Game;
    name: IIndexing<string>;
}

@Component({
    selector: '[wlc-category-preview]',
    templateUrl: './category-preview.component.html',
    styleUrls: ['./styles/category-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPreviewComponent extends AbstractComponent implements OnInit {

    public $params: Params.ICategoryPreviewCParams;
    public categories: ICategory[] = [];
    public lang: string;
    protected availableCategories: CategoryModel[];

    @Input() protected inlineParams: Params.ICategoryPreviewCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICategoryPreviewCParams,
        protected gamesCatalogService: GamesCatalogService,
        protected configService: ConfigService,
        protected translateService: TranslateService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public async ngOnInit(): Promise<void> {
        await this.gamesCatalogService.ready;
        super.ngOnInit(this.inlineParams);

        this.lang = this.translateService.currentLang;
        this.availableCategories = this.gamesCatalogService.getAvailableCategories();

        for (const category of this.availableCategories) {

            if (this.categories.length >= this.$params.categoriesCount) {
                break;
            }

            if (_includes(this.$params.categories, category.data.Slug)) {
                const gameNumber = GlobalHelper.randomNumber(0, category.games.length - 1);

                this.categories.push({
                    name: category.data.Name,
                    game: category.games[gameNumber],
                    slug: category.slug,
                    state: category.parentCategory ? 'app.catalog.child' : 'app.catalog',
                    stateParams: category.parentCategory
                        ? {
                            category: category.parentCategory.slug,
                            childCategory: category.slug,
                        } : {
                            category: category.slug,
                        },
                });
            }
        }
    }
}
