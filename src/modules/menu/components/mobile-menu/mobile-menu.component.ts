import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
    ChangeDetectorRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    EventService,
    IMenuOptions,
    IMenuItem,
} from 'wlc-engine/modules/core';
import {
    TIconExtension,
    MenuHelper,
    MenuParams,
    ICategoryMenuCParams,
} from 'wlc-engine/modules/menu';
import * as Config from 'wlc-engine/modules/menu/system/config/mobile-menu.config';
import * as Params from './mobile-menu.params';

import _clone from 'lodash-es/clone';
import _cloneDeep from 'lodash-es/cloneDeep';
import _has from 'lodash-es/has';
import _pull from 'lodash-es/pull';

@Component({
    selector: '[wlc-mobile-menu]',
    templateUrl: './mobile-menu.component.html',
    styleUrls: ['./styles/mobile-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent extends AbstractComponent implements OnInit {

    public $params: Params.IMobileMenuCParams;
    public menuParams: MenuParams.IMenuCParams;
    public categoryMenuParams: ICategoryMenuCParams;

    protected menuConfig: MenuParams.MenuConfigItem[];
    protected menuSettings: IMenuOptions;
    protected isAuth: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMobileMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected translateService: TranslateService,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<Params.IMobileMenuCParams>>{
                injectParams: injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.initEventHandlers();
        this.initConfig();
        this.initMenu();
    }

    protected initConfig(): void {
        this.menuSettings = _cloneDeep(this.configService.get('appConfig.menuSettings.mobileMenu'));
        if (this.menuSettings) {

            const itemsBefore: IMenuItem[] = this.configService.get<IMenuItem[]>('$menu.mobileMenu.fundistMenuSettings.itemsBefore');
            if (itemsBefore) {
                this.menuSettings.items = itemsBefore.concat(this.menuSettings.items);
            }

            const itemsAfter: IMenuItem[] = this.configService.get<IMenuItem[]>('$menu.mobileMenu.fundistMenuSettings.itemsAfter');
            if (itemsAfter) {
                this.menuSettings.items = this.menuSettings.items.concat(itemsAfter);
            }

            this.menuConfig = MenuHelper.parseMenuSettings(this.menuSettings, 'mobile-menu', this.translateService.currentLang, {
                isAuth: this.isAuth,
                wlcElementPrefix: 'link_mobile-nav-',
            });
        } else {
            this.menuConfig = this.configService.get<MenuParams.MenuConfigItem[]>('$menu.mobileMenu.items');
        }

        const useTournaments = this.configService.get<boolean>('$base.tournaments.use');
        if (!useTournaments) {
            this.menuConfig = _pull(this.menuConfig, 'mobile-menu:tournaments');
        }

    }

    protected initMenu(): void {
        this.menuParams = {
            type: 'mobile-menu',
            theme: this.$params.theme,
            themeMod: this.$params.themeMod,
            common: {
                icons: {
                    extension: this.configService.get<TIconExtension>('$menu.mobileMenu.icons.extension'),
                },
            },
        };

        const useIcons: boolean = _has(this.$params, 'common.icons.use')
            ? this.$params.common.icons.use
            : this.configService.get<boolean>('$menu.mobileMenu.icons.use');

        const iconsFolder: string = this.$params.common?.icons?.folder || this.configService.get<string>('$menu.mobileMenu.icons.folder');

        if (!this.menuSettings && !this.configService.get<boolean>('$menu.mobileMenu.disableCategories')) {
            this.categoryMenuParams = {
                type: 'dropdown',
                theme: 'dropdown',
                themeMod: 'vertical',
                common: {
                    icons: {
                        folder: this.configService.get<string>('$menu.mobileMenu.categoryIcons.folder'),
                        use: this.configService.get<boolean>('$menu.mobileMenu.categoryIcons.use'),
                        extension: this.configService.get<TIconExtension>('$menu.mobileMenu.categoryIcons.extension'),
                    },
                },
            };
        }

        this.menuParams.items = MenuHelper.parseMenuConfig(this.menuConfig, Config.wlcMobileMenuItemsGlobal, {
            icons: {
                folder: iconsFolder,
                disable: !useIcons,
            },
        });

        this.menuParams = _clone(this.menuParams);
        this.cdr.detectChanges();
    }

    /**
     * Init event handlers
     */
    protected initEventHandlers(): void {
        this.eventService.subscribe({
            name: 'LOGOUT',
        }, () => {
            this.isAuth = false;
        }, this.$destroy);

        this.eventService.subscribe({
            name: 'LOGIN',
        }, () => {
            this.isAuth = true;
        }, this.$destroy);
    }
}
