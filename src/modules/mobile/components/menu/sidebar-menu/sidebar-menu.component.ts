import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';

import _forEach from 'lodash-es/forEach';
import _cloneDeep from 'lodash-es/cloneDeep';
import _map from 'lodash-es/map';
import _has from 'lodash-es/has';
import _find from 'lodash-es/find';
import _includes from 'lodash-es/includes';

import {
    AbstractComponent,
    IMixedParams,
    IWrapperCParams,
    ConfigService,
} from 'wlc-engine/modules/core';
import {MenuHelper} from'wlc-engine/modules/menu/system/helpers/menu.helper';

import * as Config from 'wlc-engine/modules/mobile/system/config/sidebar-menu.config';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as Params from './sidebar-menu.params';

@Component({
    selector: '[wlc-sidebar-menu]',
    templateUrl: './sidebar-menu.component.html',
    styleUrls: ['./styles/sidebar-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMenuComponent extends AbstractComponent implements OnInit {
    public $params!: Params.ISidebarMenuCParams;
    public menus: IWrapperCParams[] = [];

    protected menuConfig!: MenuParams.MenuConfigItem[][];
    protected useIcons!: boolean;
    protected iconsFolder!: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISidebarMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected router: UIRouter,
    ) {
        super(
            <IMixedParams<Params.ISidebarMenuCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.initConfig();
        this.initMenu();
    }

    protected initConfig(): void {
        this.menuConfig = this.configService.get<MenuParams.MenuConfigItem[][]>('$mobile.sidebarMenu.items') || [];
    }

    protected initMenu(): void {
        _forEach(this.menuConfig, (config: MenuParams.MenuConfigItem[]): void => {
            const menuParams = _cloneDeep(this.$params.menuParams);
            let menuItemsConfig;

            if (this.router.globals.current.name === 'app.menu.item') {
                const menuItem: MenuParams.MenuConfigItem =
                    _find(config, (item: MenuParams.MenuConfigItem): boolean => {
                        if (_has(item, 'parent')) {
                            return _includes(item['parent'], this.router.globals.params['item']);
                        }
                        return false;
                    });

                if (!menuItem) {
                    return;
                }
                menuItemsConfig = (menuItem as MenuParams.MenuConfigItemsGroup).items;
            } else {
                menuItemsConfig = _map(config, (menuItem) => {
                    if (_has(menuItem, 'parent')) {
                        return menuItem['parent'];
                    }
                    return menuItem;
                });
            }

            menuParams.items = MenuHelper.parseMenuConfig(
                menuItemsConfig,
                Config.wlcSidebarMenuItemsGlobal,
                {
                    icons: {
                        folder: '',
                        disable: true,
                    },
                },
            );

            const params: IWrapperCParams = {
                components: [
                    {
                        name: 'menu.wlc-menu',
                        params: menuParams,
                    },
                ],
            };
            this.menus.push(params);
        });
        this.cdr.detectChanges();
    }
}
