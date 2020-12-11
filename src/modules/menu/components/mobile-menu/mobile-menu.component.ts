import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
    ChangeDetectorRef,
} from '@angular/core';

import * as Params from './mobile-menu.params';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as CategoryMenuParams from 'wlc-engine/modules/menu/components/category-menu/category-menu.params';
import * as Config from 'wlc-engine/modules/menu/system/config/mobile-menu.config';
import {ConfigService} from 'wlc-engine/modules/core';
import {MenuHelper} from 'wlc-engine/modules/menu/system/helpers/menu.helper';
import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

import {
    clone as _clone,
} from 'lodash';

@Component({
    selector: '[wlc-mobile-menu]',
    templateUrl: './mobile-menu.component.html',
    styleUrls: ['./styles/mobile-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent extends AbstractComponent implements OnInit {

    public $params: Params.IMobileMenuCParams;
    public menuParams: MenuParams.IMenuCParams;
    public categoryMenuParams: CategoryMenuParams.ICategoryMenuCParams = {
        type: 'dropdown',
    };

    protected menuConfig: MenuParams.MenuConfigItem[];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMobileMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
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
        this.initConfig();
        this.initMenu();
    }

    protected initConfig(): void {
        const configMenu = this.configService.get<MenuParams.MenuConfigItem[]>('$base.mobileMenu');
        this.menuConfig = configMenu || Config.wlcMobileMenuItemsDefault;
    }

    protected initMenu(): void {
        this.menuParams = {
            type: 'mobile-menu',
            theme: this.$params.theme,
            themeMod: this.$params.themeMod,
        };
        this.menuParams.items = MenuHelper.parseMenuConfig(this.menuConfig, Config.wlcMobileMenuItemsGlobal);
        this.menuParams = _clone(this.menuParams);
        this.cdr.markForCheck();
    }

}
