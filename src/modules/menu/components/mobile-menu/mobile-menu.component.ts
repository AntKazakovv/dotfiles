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
    has as _has,
} from 'lodash-es';

@Component({
    selector: '[wlc-mobile-menu]',
    templateUrl: './mobile-menu.component.html',
    styleUrls: ['./styles/mobile-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent extends AbstractComponent implements OnInit {

    public $params: Params.IMobileMenuCParams;
    public menuParams: MenuParams.IMenuCParams;
    public categoryMenuParams: CategoryMenuParams.ICategoryMenuCParams;

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
        this.menuConfig = this.configService.get<MenuParams.MenuConfigItem[]>('$menu.mobileMenu.items');
    }

    protected initMenu(): void {
        this.menuParams = {
            type: 'mobile-menu',
            theme: this.$params.theme,
            themeMod: this.$params.themeMod,
            common: {
                useArrow: this.$params.common?.useArrow,
            },
        };

        const useIcons: boolean = _has(this.$params, 'common.icons.use')
            ? this.$params.common.icons.use
            : this.configService.get<boolean>('$menu.mobileMenu.icons.use');

        const iconsFolder: string = this.$params.common?.icons?.folder || this.configService.get<string>('$menu.mobileMenu.icons.folder');

        this.categoryMenuParams = {
            type: 'dropdown',
            theme: 'dropdown',
            themeMod: 'vertical',
            common: {
                icons: {
                    folder: this.configService.get<string>('$menu.mobileMenu.categoryIcons.folder'),
                    use: this.configService.get<boolean>('$menu.mobileMenu.categoryIcons.use'),
                },
            },
        };

        this.menuParams.items = MenuHelper.parseMenuConfig(this.menuConfig, Config.wlcMobileMenuItemsGlobal, {
            icons: {
                folder: iconsFolder,
                disable: !useIcons,
            },
        });
        this.menuParams = _clone(this.menuParams);
        this.cdr.markForCheck();
    }

}
