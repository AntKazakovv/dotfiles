import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
    OnDestroy,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';

import _clone from 'lodash-es/clone';
import _has from 'lodash-es/has';
import _set from 'lodash-es/set';
import _merge from 'lodash-es/merge';
import {
    BehaviorSubject,
    takeUntil,
} from 'rxjs';

import {
    AbstractComponent,
    AppType,
    EventService,
    DeviceType,
    IMixedParams,
    ProfileType,
    ActionService,
} from 'wlc-engine/modules/core';
import {
    TIconExtension,
    IMenuOptions,
    ProfileMenuService,
    MenuParams,
} from 'wlc-engine/modules/menu';

import * as Params from './profile-menu.params';

@Component({
    selector: '[wlc-profile-menu]',
    templateUrl: './profile-menu.component.html',
    styleUrls: ['./styles/profile-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileMenuComponent extends AbstractComponent implements OnInit, OnDestroy {
    public override $params: Params.IProfileMenuCParams;
    public menuParams: MenuParams.IMenuCParams;
    public useSliderNavigation: boolean = false;
    public showSliderNavigation: boolean = false;
    public ready$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    protected isMobile: boolean = false;
    protected iconsFolder: string;
    protected useIcons: boolean;
    protected profileConfig: string;
    protected sliderNavigationOptions: Params.ISliderNavigation;
    protected menuConfig: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IProfileMenuCParams,
        protected actionService: ActionService,
        protected eventService: EventService,
        protected profileMenuService: ProfileMenuService,
        protected router: UIRouter,
    ) {
        super(
            <IMixedParams<Params.IProfileMenuCParams>>{
                injectParams: injectParams,
                defaultParams: Params.defaultParams,
            },
        );
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.menuConfig = Params.menuConfigs[this.$params.theme];
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
            this.configService.get<boolean>('$bonuses.unitedPageBonuses') ?
                this.profileConfig = 'profileFirstMenuUnitedBonuses' :
                this.profileConfig = 'profileFirstMenu';
        } else {
            this.profileConfig = 'profileMenu';
        }

        if (this.$params.type === 'tabs' || this.$params.type === 'submenu') {
            this.sliderNavigationOptions = this.menuConfig[this.$params.type]?.sliderNavigation;
            this.useSliderNavigation = !!this.sliderNavigationOptions?.use;
            this.setSliderNavigationVisibility();
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

        this.initEventHandlers();
        this.initMenu();
    }

    protected setSliderNavigationVisibility(): void {
        if (!this.useSliderNavigation) {
            return;
        }

        switch (this.sliderNavigationOptions.forDevice) {
            case 'mobile':
                this.showSliderNavigation = this.isMobile;
                break;
            case 'desktop':
                this.showSliderNavigation = !this.isMobile;
                break;
            default:
                this.showSliderNavigation = true;
        }
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
                if (this.menuConfig[this.$params.type]?.menuParams) {
                    _merge(this.menuParams, this.menuConfig[this.$params.type].menuParams);

                    if (this.menuConfig[this.$params.type]?.menuParams.common?.useSwiper) {
                        this.addModifiers('swiper');
                    }
                }
                this.menuParams.items = await this.profileMenuService.getTabsMenu(menuOptions);
                iconsKey = 'icons';
                break;
            case 'submenu':
                if (this.menuConfig[this.$params.type]?.menuParams) {
                    _merge(this.menuParams, this.menuConfig[this.$params.type].menuParams);
                }

                this.menuParams.items = await this.profileMenuService.getSubMenu(menuOptions);
                iconsKey = 'subMenuIcons';

                break;
            case 'full':
                this.menuParams.items = await this.profileMenuService.getFullMenu(menuOptions);
                iconsKey = 'dropdownMenuIcons';
                break;
            case 'dropdown':
                this.menuParams.items = await this.profileMenuService.getDropdownMenu(menuOptions);
                iconsKey = 'dropdownMenuIcons';
                break;
        }

        const extension: TIconExtension = this.configService
            .get<TIconExtension>(`$menu.${this.profileConfig}.${iconsKey}.extension`);
        _set(this.menuParams, 'common.icons.extension', extension);

        this.menuParams = _clone(this.menuParams);
        this.ready$.next(true);
        this.cdr.detectChanges();
    }

    protected initEventHandlers(): void {
        this.eventService.subscribe({name: 'TRANSITION_SUCCESS'}, (): void => {
            if (this.profileConfig === 'profileMenu' || this.$params.type === 'submenu') {
                this.menuParams.items = [];
                this.initMenu();
            }
        }, this.$destroy);

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                if (!type) {
                    return;
                }
                this.isMobile = type !== DeviceType.Desktop;
                this.setSliderNavigationVisibility();
                this.cdr.markForCheck();
            });
    }
}
