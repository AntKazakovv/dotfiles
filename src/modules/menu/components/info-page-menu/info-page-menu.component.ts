import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UIRouter} from '@uirouter/core';

import _clone from 'lodash-es/clone';
import _flatten from 'lodash-es/flatten';
import _cloneDeep from 'lodash-es/cloneDeep';
import _forEach from 'lodash-es/forEach';
import _sortBy from 'lodash-es/sortBy';
import {takeUntil} from 'rxjs/operators';

import {
    DeviceType,
    EventService,
    IMenuOptions,
    IPostDataOptions,
} from 'wlc-engine/modules/core';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ActionService} from 'wlc-engine/modules/core/system/services/action/action.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {StaticService} from 'wlc-engine/modules/static/system/services/static/static.service';
import {MenuService} from 'wlc-engine/modules/menu/system/services';
import {TextDataModel} from 'wlc-engine/modules/static/system/models/textdata.model';
import {WpItemType} from 'wlc-engine/modules/menu/components/menu/menu.params';
import {MenuHelper} from 'wlc-engine/modules/menu/system/helpers';

import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as Params from './info-page-menu.params';
import * as Config from 'wlc-engine/modules/menu/system/config/info-page-menu.config';

@Component({
    selector: '[wlc-info-page-menu]',
    templateUrl: './info-page-menu.component.html',
    styleUrls: ['./styles/info-page-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoPageMenuComponent extends AbstractComponent implements OnInit {
    public isReady: boolean = false;
    public menuParams: MenuParams.IMenuCParams;
    public parentName: string;
    public parentSlug: string;
    public type: WpItemType = 'sref';
    public basePath: string;
    public override $params: Params.IInfoPageMenuCParams;

    protected staticService: StaticService;
    protected wlcElementPrefix: string;
    protected menuSettings: IMenuOptions;
    protected menuConfig: MenuParams.MenuConfigItem[];
    protected isMobile: boolean;
    protected posts: TextDataModel[][];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IInfoPageMenuCParams,
        protected injectionService: InjectionService,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected translateService: TranslateService,
        protected eventService: EventService,
        protected actionService: ActionService,
        protected menuService: MenuService,
        protected router: UIRouter,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.prepareParams();

        const postOptions: IPostDataOptions = {
            categorySlug: this.$params.categorySlug,
            exclude: this.$params.exclude,
        };

        this.isMobile = this.configService.get<boolean>('appConfig.mobile');
        this.staticService = await this.injectionService.getService<StaticService>('static.static-service');
        this.posts = await this.menuService.getWpPosts(postOptions);

        this.initMenu();

        this.isReady = true;
        this.initEventHandlers();
        this.cdr.markForCheck();
    }

    protected prepareParams(): void {
        if (this.$params.basePath?.url) {
            this.type = 'href';
            this.setBasePath();
        }

        this.wlcElementPrefix = 'link_';
        if (this.$params.theme === 'contacts') {
            this.wlcElementPrefix = 'left_link_';
        }
    }

    protected setBasePath(): void {
        this.basePath = MenuHelper.getHrefItemBasePath({
            url: this.$params.basePath?.url,
            lang: this.$params.basePath?.addLanguage ? this.translateService.currentLang : '',
            page: this.$params.basePath?.page,
        });
    }

    protected setParent(): void {
        if (this.isMobile) {
            const postsData: Params.IPostDataMenu[] = this.modifyPostData(_flatten(this.posts));
            let currentSlug: string = this.router.globals.params.slug;

            this.parentName = this.getActivePostData(postsData, currentSlug, true);
            this.parentSlug = this.getActivePostData(postsData, currentSlug, false);

            this.router.transitionService.onSuccess({}, () => {
                currentSlug = this.router.globals.params.slug;
                this.parentName = this.getActivePostData(postsData, currentSlug, true);
                this.parentSlug = this.getActivePostData(postsData, currentSlug, false);
                this.initMenu();
            });
        }
    }

    protected getActivePostData(posts: Params.IPostDataMenu[], currentSlug: string, searchName?: boolean): string {
        if (searchName) {
            return posts.find((post) => post.slug === currentSlug).name;
        } else {
            return posts.find((post) => post.slug === currentSlug).slug;
        }
    }

    protected async initMobileConfig(): Promise<void> {
        this.menuSettings = _cloneDeep(await this.menuService.getFundistMenuSettings('infoPageMenu', true));

        if (this.menuSettings) {
            this.menuConfig = MenuHelper
                .parseMenuSettings(this.menuSettings, 'info-page-menu', this.translateService.currentLang, {
                    wlcElementPrefix: 'link_panel-nav-',
                    parentWithIcon: true,
                    parentAsLink: true,
                });
        }
    }

    protected async initMenu(): Promise<void> {
        this.$params.menuParams.items = [];
        if (this.isMobile) {
            await this.initMobileConfig();
            this.setParent();

            this.menuParams = {
                type: 'info-page-menu',
                theme: this.$params.theme,
                themeMod: this.$params.themeMod,
                dropdowns: {
                    expandableOnClick: true,
                    expandByParent: false,
                },
            };

            this.menuParams.items = MenuHelper.parseMenuConfig(this.menuConfig, Config.wlcInfoPageMenuItemsGlobal, {
                modifyParent: {
                    name: this.parentName,
                    slug: this.parentSlug,
                },
                icons: {
                    folder: this.$params.icons?.folder,
                    disable: !this.$params.icons?.use,
                },
            });

            MenuHelper.configureCategories(this.menuParams.items, {
                type: 'default',
                theme: 'default',
                themeMod: 'vertical',
                common: {
                    icons: {
                        folder: this.configService.get<string>('$menu.infoPageMenu.icons.folder'),
                        use: this.configService.get<boolean>('$menu.infoPageMenu.icons.use'),
                    },
                },
            });

            this.menuParams = _clone(this.menuParams);

            this.cdr.markForCheck();
        } else {
            this.$params.menuParams.items = MenuHelper.getItemsByWpPosts({
                posts: _flatten(this.posts),
                defaultItemState: this.$params.defaultState,
                defaultItemType: this.type,
                hrefBasePath: this.basePath,
                wlcElementPrefix: this.wlcElementPrefix,
                iconFolder: 'wlc/icons/european/v3',
            });
        }
    }

    protected initEventHandlers(): void {
        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {

                this.isMobile = type !== DeviceType.Desktop;
                this.setParent();
                this.initMenu();
            });
    }

    protected modifyPostData(posts: TextDataModel[]): Params.IPostDataMenu[] {
        const wpItems: TextDataModel[] = _sortBy(posts, (item) => item.sortOrder);
        const postsData: Params.IPostDataMenu[] = [];

        _forEach(wpItems, (wpItem: TextDataModel) => {
            const wpItemData: Params.IPostDataMenu = {
                name: wpItem.title,
                slug: wpItem.slug,
                icon: wpItem.image,
            };
            postsData.push(wpItemData);
        });
        return postsData;
    }
}
