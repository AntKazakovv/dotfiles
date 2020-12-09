import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector,
    OnInit,
} from '@angular/core';

import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as Params from 'wlc-engine/modules/menu/components/main-menu/main-menu.params';
import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    LayoutService,
    EventService,
} from 'wlc-engine/modules/core/system/services';
import {gamesEvents} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {IMenuItem} from 'wlc-engine/modules/menu/components/menu/menu.params';
import {MenuHelper} from 'wlc-engine/modules/menu/system/helpers/menu.helper';
import {TranslateService} from '@ngx-translate/core';
import {MenuItemType} from 'wlc-engine/modules/menu/components/menu/menu.params';

import {
    concat as _concat,
    clone as _clone,
} from 'lodash';

@Component({
    selector: '[wlc-main-menu]',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./styles/main-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent extends AbstractComponent implements OnInit {
    public items: MenuParams.IMenuItem[];
    public $params: Params.IMainMenuCParams;
    public menuParams: MenuParams.IMenuCParams = {
        type: 'main-menu',
        items: [],
    };

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMainMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected injector: Injector,
        protected layoutService: LayoutService,
        protected gamesCatalogService: GamesCatalogService,
        protected translate: TranslateService,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<Params.IMainMenuCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
        );
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.menuParams.items = MenuHelper.getItems(
            {
                items: null,
                type: this.menuParams.type,
            },
        );

        if (this.gamesCatalogService.getGameList()) {
            this.addCategoryBtns();
        } else {
            this.eventService.subscribe({
                name: gamesEvents.FETCH_GAME_CATALOG_SUCCEEDED,
            }, () => {
                this.addCategoryBtns();
            });
        }
        this.cdr.markForCheck();
    }

    protected addCategoryBtns(): void {
        const categories: CategoryModel[] = this.gamesCatalogService.getCategoriesByMenu('main-menu');
        if (!categories) {
            return;
        }

        const menuItems: MenuParams.IMenuItem[] = MenuHelper.getItemsForCategories({
            categories: categories,
            lang: this.translate.currentLang,
        });

        this.menuParams.items = menuItems.concat(this.menuParams.items as MenuParams.IMenuItem[]);
        this.menuParams = _clone(this.menuParams);
        this.cdr.markForCheck();
    }
}
