import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
    ChangeDetectorRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import _clone from 'lodash-es/clone';
import _cloneDeep from 'lodash-es/cloneDeep';
import _pull from 'lodash-es/pull';
import _set from 'lodash-es/set';
import {
    BehaviorSubject,
    takeUntil,
} from 'rxjs';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {
    IMenuOptions,
} from 'wlc-engine/modules/core/system/interfaces/menu.interface';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {TIconExtension} from 'wlc-engine/modules/menu/system/interfaces/menu.interface';
import {MenuHelper} from 'wlc-engine/modules/menu/system/helpers/menu.helper';
import {MenuService} from 'wlc-engine/modules/menu/system/services/menu.service';
import {TFixedPanelStore} from 'wlc-engine/modules/core/system/interfaces/base-config/fixed-panel.interface';
import {
    ActionService,
    DeviceType,
} from 'wlc-engine/modules/core';

import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as Config from 'wlc-engine/modules/menu/system/config/panel-menu.config';

import * as Params from './panel-menu.params';

@Component({
    selector: '[wlc-panel-menu]',
    templateUrl: './panel-menu.component.html',
    styleUrls: ['./styles/panel-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelMenuComponent extends AbstractComponent implements OnInit {

    public override $params: Params.IPanelMenuCParams;

    protected menuConfig: MenuParams.MenuConfigItem[];
    protected menuSettings: IMenuOptions;
    protected isAuth: boolean;
    protected isMobile: boolean = false;
    protected fixedPanelStore$ = this.configService.get<BehaviorSubject<TFixedPanelStore>>('fixedPanelStore$');

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPanelMenuCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected translateService: TranslateService,
        protected eventService: EventService,
        protected injectionService: InjectionService,
        protected menuService: MenuService,
        protected actionService: ActionService,
    ) {
        super(
            <IMixedParams<Params.IPanelMenuCParams>>{
                injectParams: injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
            cdr,
        );
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();

        if (this.fixedPanelStore$.getValue().left === 'compact') {
            this.addModifiers('compact');
        }

        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.configService.get<boolean>('appConfig.mobile');

        await this.initConfig();
        this.initMenu();
        this.initEventHandlers();

        this.cdr.markForCheck();
    }

    protected async initConfig(): Promise<void> {
        if (this.$params.type === 'info') {
            this.menuSettings = _cloneDeep(await this.menuService.getFundistMenuSettings('panelMenuInfo'));
        } else {
            this.menuSettings = _cloneDeep(await this.menuService.getFundistMenuSettings('panelMenu'));
        }

        if (this.menuSettings) {
            this.menuConfig = MenuHelper
                .parseMenuSettings(this.menuSettings, 'panel-menu', this.translateService.currentLang, {
                    isAuth: this.isAuth,
                    wlcElementPrefix: 'link_panel-nav-',
                    parentWithIcon: true,
                    parentAsLink: true,
                });
        }

        if (!this.menuConfig) {
            this.menuConfig = this.$params.type === 'info'
                ? this.configService.get<MenuParams.MenuConfigItem[]>('$menu.panelMenu.itemsInfo')
                : this.configService.get<MenuParams.MenuConfigItem[]>('$menu.panelMenu.items');
        }

        if (this.$params.type !== 'info') {
            const useTournaments = this.configService.get<boolean>('$base.tournaments.use');
            if (!useTournaments) {
                this.menuConfig = _pull(this.menuConfig, 'panel-menu:tournaments');
            }
        }
    }

    protected initMenu(): void {
        this.$params.menuParams.items = MenuHelper.parseMenuConfig(this.menuConfig, Config.wlcPanelMenuItemsGlobal, {
            icons: {
                folder: this.$params.icons?.folder,
                disable: !this.$params.icons?.use,
            },
            tooltip: {
                submenuDisable: true,
            },
        });

        MenuHelper.configureCategories(this.$params.menuParams.items, {
            type: 'dropdown',
            theme: 'dropdown',
            themeMod: 'vertical',
            common: {
                icons: {
                    folder: this.configService.get<string>('$menu.panelMenu.icons.folder'),
                    use: this.configService.get<boolean>('$menu.panelMenu.icons.use'),
                    extension: this.configService.get<TIconExtension>('$menu.panelMenu.icons.extension'),
                },
            },
            menuParams: {
                tooltip: {
                    use: true,
                    containerClass: 'wlc-tooltip-wolf',
                },
            },
        });

        this.$params.menuParams = _clone(this.$params.menuParams);
    }

    /**
     * Init event handlers
     */
    protected initEventHandlers(): void {
        let defaultValueExpandOnStart: boolean = this.$params.menuParams.expandOnStart;

        this.configService.get<BehaviorSubject<boolean>>('$user.isAuth$')
            .pipe(takeUntil(this.$destroy))
            .subscribe((value) => {
                this.isAuth = value;
            });

        this.fixedPanelStore$
            .pipe(takeUntil(this.$destroy))
            .subscribe((store: TFixedPanelStore) => {
                this.$params.menuParams.tooltip.use = store.left === 'compact';

                if (defaultValueExpandOnStart) {
                    this.$params.menuParams.expandOnStart = store.left !== 'compact';
                }

                const isExpandableOnHover = store.left === 'compact' && !this.isMobile;

                const categoriesItemMenu = this.$params.menuParams.items
                    .find((item) => (item as MenuParams.IMenuItem).type === 'categories') as MenuParams.IMenuItem;
                if (categoriesItemMenu) {
                    _set(categoriesItemMenu, 'params.categories.componentParams.menuParams.dropdowns', {
                        expandableOnHover: isExpandableOnHover,
                    });
                } else {
                    this.$params.menuParams.dropdowns.expandableOnHover = isExpandableOnHover;
                }

                this.$params.menuParams = _clone(this.$params.menuParams);

                if (store.left === 'compact') {
                    this.addModifiers('compact');
                } else {
                    this.clearModifiers();
                }

                this.cdr.detectChanges();
            });

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                this.isMobile = type !== DeviceType.Desktop;
            });
    }
}
