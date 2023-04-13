import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import _set from 'lodash-es/set';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {MenuHelper} from'wlc-engine/modules/menu/system/helpers/menu.helper';
import {TIconExtension} from'wlc-engine/modules/menu/system/interfaces/menu.interface';

import * as Config from 'wlc-engine/modules/menu/system/config/mobile-footer-menu.config';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as Params from 'wlc-engine/modules/menu/components/mobile-footer-menu/mobile-footer-menu.params';

@Component({
    selector: '[wlc-mobile-footer-menu]',
    templateUrl: './mobile-footer-menu.component.html',
    styleUrls: ['./styles/mobile-footer-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileFooterMenuComponent extends AbstractComponent implements OnInit {
    public override $params!: Params.IMobileFooterMenuCParams;

    protected menuConfig!: MenuParams.MenuConfigItem[];
    protected useIcons!: boolean;
    protected iconsFolder!: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMobileFooterMenuCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.IMobileFooterMenuCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
            cdr,
        );
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.initConfig();
        this.initMenu();
    }

    protected initConfig(): void {
        this.menuConfig = this.configService.get<MenuParams.MenuConfigItem[]>('$menu.mobileFooterMenu.items') || [];
    }

    protected initMenu(): void {
        this.useIcons = !!(this.$params.common?.icons?.use
            || this.configService.get<boolean>('$menu.mobileFooterMenu.icons.use'));

        this.iconsFolder = (this.$params.common?.icons?.folder
            || this.configService.get<string>('$menu.mobileFooterMenu.icons.folder')) || '';

        const extension: undefined | TIconExtension =
            this.configService.get<TIconExtension>('$menu.mobileFooterMenu.icons.extension');

        if (extension) {
            _set(this.$params, 'menuParams.common.icons.extension', extension);
        }

        this.$params.menuParams.items = MenuHelper.parseMenuConfig(
            this.menuConfig,
            Config.wlcMobileFooterMenuItemsGlobal,
            {
                icons: {
                    folder: this.iconsFolder,
                    disable: !this.useIcons,
                },
            },
        );
        this.cdr.markForCheck();
    }
}
