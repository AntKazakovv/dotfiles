import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    Inject,
} from '@angular/core';

import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import {IMenuOptions, ProfileMenuService} from 'wlc-engine/modules/menu/system/services';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as Params from './profile-menu.params';
import {UIRouter} from '@uirouter/core';

import _clone from 'lodash-es/clone';
import _has from 'lodash-es/has';
import _concat from 'lodash-es/concat';

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

        this.iconsFolder = this.$params.common?.icons?.folder || this.configService.get<string>(`$menu.${this.profileType}.${configKey}.folder`);

        this.menuParams = {
            type: this.profileType === 'profileFirstMenu' ? 'profile-first-menu' : 'profile-menu',
            theme: this.$params.theme,
            themeMod: this.$params.themeMod,
        };

        this.router.transitionService.onSuccess({}, (transition) => {
            if(this.profileType !== 'profileFirstMenu') {
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

        switch (this.$params.type) {
            case 'tabs':
                this.menuParams.items = this.profileMenuService.getTabsMenu(menuOptions);
                break;
            case 'submenu':
                this.menuParams.items = this.profileMenuService.getSubMenu(menuOptions);
                break;
            case 'full':
            case 'dropdown':
                this.menuParams.items = this.profileMenuService.getDropdownMenu(menuOptions);
                break;
        }

        this.menuParams = _clone(this.menuParams);
        this.cdr.markForCheck();
    }
}
