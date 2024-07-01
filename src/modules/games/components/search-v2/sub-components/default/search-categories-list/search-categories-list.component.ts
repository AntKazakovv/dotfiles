import {
    Component,
    ChangeDetectionStrategy,
    Inject,
    HostBinding,
} from '@angular/core';

import {Observable} from 'rxjs';
import _includes from 'lodash-es/includes';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {openCloseAnimations} from 'wlc-engine/modules/games/system/animations/search.animations';
import {SearchControllerDefault} from 'wlc-engine/modules/games/components/search-v2';
import {CategoryModel} from 'wlc-engine/modules/games/system/models';

import * as Params from './search-categories-list.params';

@Component({
    selector: '[wlc-search-categories-list]',
    templateUrl: './search-categories-list.component.html',
    styleUrls: ['./styles/search-categories-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [openCloseAnimations],
})
export class SearchCategoriesListComponent extends AbstractComponent {
    @HostBinding('@openClose') protected animation = true;

    constructor(
        @Inject (SearchControllerDefault) protected $searchControllerDefault: SearchControllerDefault,
        configService: ConfigService,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public chooseCategory(category?: CategoryModel): void {
        this.$searchControllerDefault.setValueChooseCategory(category);
    }

    public getCategories(): Observable<CategoryModel[]> {
        return this.$searchControllerDefault.categories$;
    }

    public isActive(slug: string): boolean {
        return _includes(this.$searchControllerDefault.filters.categories, slug);
    }

    public isActiveList(): boolean {
        return !this.$searchControllerDefault.filters.categories.length;
    }

    public currentLang(): string {
        return this.$searchControllerDefault.currentLang;
    }
}
