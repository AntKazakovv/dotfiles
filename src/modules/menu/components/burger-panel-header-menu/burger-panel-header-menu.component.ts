import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
    ChangeDetectorRef,
} from '@angular/core';
import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {
    MenuHelper,
    MenuParams,
    IBurgerPanelHeaderMenu,
} from 'wlc-engine/modules/menu';
import * as Config from 'wlc-engine/modules/menu/system/config/burger-panel-header-menu.items.config';
import * as Params from './burger-panel-header-menu.params';

import _cloneDeep from 'lodash-es/cloneDeep';

@Component({
    selector: '[wlc-burger-panel-header-menu]',
    templateUrl: './burger-panel-header-menu.component.html',
    styleUrls: ['./styles/burger-panel-header-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BurgerPanelHeaderMenuComponent extends AbstractComponent implements OnInit {

    public $params: Params.IBurgerPanelHeaderMenuCParams;
    public menuParams: MenuParams.IMenuCParams;

    protected headerMenu: IBurgerPanelHeaderMenu;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBurgerPanelHeaderMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<Params.IBurgerPanelHeaderMenuCParams>>{
                injectParams: injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.initMenu();
    }

    protected initMenu(): void {
        this.headerMenu = this.configService
            .get<IBurgerPanelHeaderMenu>(`$menu.burgerPanel.${this.$params.common.panelType}.headerMenu`);

        if (this.headerMenu?.use) {
            if (this.headerMenu.enableByFundistMenuSettings && !this.configService.get('appConfig.menuSettings')) {
                return;
            }
            this.initMenuParams();
            this.initEventHandlers();
        }
    }

    protected initMenuParams(): void {
        const items: MenuParams.MenuConfigItem[] = this.headerMenu.items;
        if (items) {
            const menuParams: MenuParams.IMenuCParams = _cloneDeep(this.headerMenu.menuParams);
            const iconsFolder: string =  this.headerMenu.icons?.folder;
            menuParams.items = MenuHelper.parseMenuConfig(items, Config.wlcBurgerPanelHeaderMenuItemsGlobal, {
                icons: {
                    folder: iconsFolder,
                    disable: false,
                },
            });
            this.menuParams = menuParams;
            this.cdr.detectChanges();
        }
    }

    /**
     * Init event handlers
     */
    protected initEventHandlers(): void {
        this.eventService.subscribe([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
        ], () => {
            this.initMenuParams();
            this.cdr.detectChanges();
        }, this.$destroy);
    }
}
