import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    Inject,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
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
export class ProfileMenuComponent extends AbstractComponent implements OnInit {
    public $params: Params.IProfileMenuCParams;
    public menuParams: MenuParams.IMenuCParams;

    protected iconsFolder: string;
    protected useIcons: boolean;
    protected profileType: string;

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

        this.profileType = this.configService.get<string>('$base.profile.type') === 'first'
            ? 'profileFirstMenu'
            : 'profileMenu';

        this.useIcons = _has(this.$params, 'common.icons.use')
            ? this.$params.common.icons.use
            : this.configService.get<boolean>(`$menu.${this.profileType}.${configKey}.use`);

        this.iconsFolder = this.$params.common?.icons?.folder
            || this.configService.get<string>(`$menu.${this.profileType}.${configKey}.folder`);

        this.menuParams = {
            type: this.profileType === 'profileFirstMenu' ? 'profile-first-menu' : 'profile-menu',
            theme: this.$params.theme,
            themeMod: this.$params.themeMod,
        };

        this.router.transitionService.onSuccess({}, () => {
            if (this.profileType !== 'profileFirstMenu' || this.$params.type === 'submenu') {
                this.menuParams.items = [];
                this.initMenu();
            }
        });
        this.initMenu();
    }

    /**
     * Init menu
     */
    protected initMenu(): void {
        const menuOptions: IMenuOptions = {
            icons: {
                folder: this.iconsFolder,
                disable: !this.useIcons,
            },
        };
        let iconsKey: string;

        switch (this.$params.type) {
            case 'tabs':
                this.menuParams.items = this.profileMenuService.getTabsMenu(menuOptions);
                iconsKey = 'icons';
                break;
            case 'submenu':
                this.menuParams.items = this.profileMenuService.getSubMenu(menuOptions);
                iconsKey = 'subMenuIcons';
                break;
            case 'full':
            case 'dropdown':
                this.menuParams.items = this.profileMenuService.getDropdownMenu(menuOptions);
                iconsKey = 'dropdownMenuIcons';
                break;
        }

        const extension: TIconExtension = this.configService
            .get<TIconExtension>(`$menu.${this.profileType}.${iconsKey}.extension`);
        _set(this.menuParams, 'common.icons.extension', extension);

        this.menuParams = _clone(this.menuParams);
        this.cdr.detectChanges();
    }
}
