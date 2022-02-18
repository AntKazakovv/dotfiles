import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    Inject,
    OnDestroy,
} from '@angular/core';

import {
    AbstractComponent,
    AppType,
    IMixedParams,
    ProfileType,
} from 'wlc-engine/modules/core';
import {UIRouter} from '@uirouter/core';
import {ConfigService} from 'wlc-engine/modules/core';
import {
    TIconExtension,
    IMenuOptions,
    ProfileMenuService,
    MenuParams,
} from 'wlc-engine/modules/menu';
import * as Params from './profile-menu.params';

import _clone from 'lodash-es/clone';
import _has from 'lodash-es/has';
import _set from 'lodash-es/set';

@Component({
    selector: '[wlc-profile-menu]',
    templateUrl: './profile-menu.component.html',
    styleUrls: ['./styles/profile-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileMenuComponent extends AbstractComponent implements OnInit, OnDestroy {
    public $params: Params.IProfileMenuCParams;
    public menuParams: MenuParams.IMenuCParams;

    protected iconsFolder: string;
    protected useIcons: boolean;
    protected profileConfig: string;
    protected transitionOnSuccessDestroy: Function;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IProfileMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected profileMenuService: ProfileMenuService,
        protected router: UIRouter,
    ) {
        super(
            <IMixedParams<Params.IProfileMenuCParams>>{
                injectParams: injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
        
    }

    public ngOnInit(): void {
        super.ngOnInit();

        let configKey: string = 'icons';
        switch (this.$params.type) {
            case 'tabs':
                configKey = 'icons';
                break;
            case 'submenu':
                configKey = 'subMenuIcons';
                break;
            case 'full':
            case 'dropdown':
                configKey = 'dropdownMenuIcons';
                break;
        }

        if (this.configService.get<AppType>('$base.app.type') === 'kiosk') {
            this.profileConfig = 'profileKioskMenu';
        } else if (this.configService.get<ProfileType>('$base.profile.type') === 'first') {
            this.profileConfig = 'profileFirstMenu';
        } else {
            this.profileConfig = 'profileMenu';
        }

        this.useIcons = _has(this.$params, 'common.icons.use')
            ? this.$params.common.icons.use
            : this.configService.get<boolean>(`$menu.${this.profileConfig}.${configKey}.use`);

        this.iconsFolder = this.$params.common?.icons?.folder
            || this.configService.get<string>(`$menu.${this.profileConfig}.${configKey}.folder`);

        this.menuParams = {
            type: this.profileConfig === 'profileMenu' ? 'profile-menu' : 'profile-first-menu',
            theme: this.$params.theme,
            themeMod: this.$params.themeMod,
        };

        this.transitionOnSuccessDestroy = this.router.transitionService.onSuccess({}, () => {
            if (this.profileConfig === 'profileMenu' || this.$params.type === 'submenu') {
                this.menuParams.items = [];
                this.initMenu();
            }
        });
        this.initMenu();
    }

    public ngOnDestroy(): void {
        this.transitionOnSuccessDestroy();
    }

    /**
     * Init menu
     */
    protected async initMenu(): Promise<void> {
        const menuOptions: IMenuOptions = {
            icons: {
                folder: this.iconsFolder,
                disable: !this.useIcons,
            },
        };
        let iconsKey: string;

        switch (this.$params.type) {
            case 'tabs':
                this.menuParams.items = await this.profileMenuService.getTabsMenu(menuOptions);
                iconsKey = 'icons';
                break;
            case 'submenu':
                this.menuParams.items = await this.profileMenuService.getSubMenu(menuOptions);
                iconsKey = 'subMenuIcons';
                break;
            case 'full':
            case 'dropdown':
                this.menuParams.items = await this.profileMenuService.getDropdownMenu(menuOptions);
                iconsKey = 'dropdownMenuIcons';
                break;
        }

        const extension: TIconExtension = this.configService
            .get<TIconExtension>(`$menu.${this.profileConfig}.${iconsKey}.extension`);
        _set(this.menuParams, 'common.icons.extension', extension);

        this.menuParams = _clone(this.menuParams);
        this.cdr.detectChanges();
    }
}
