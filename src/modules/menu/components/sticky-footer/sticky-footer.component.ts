import {
    Component,
    Inject,
    OnInit,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';
import {
    TranslateService,
} from '@ngx-translate/core';

import _set from 'lodash-es/set';
import _cloneDeep from 'lodash-es/cloneDeep';
import _has from 'lodash-es/has';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core';

import {MenuHelper} from'wlc-engine/modules/menu/system/helpers/menu.helper';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {TIconExtension} from'wlc-engine/modules/menu/system/interfaces/menu.interface';
import {IMenuOptions} from 'wlc-engine/modules/core/system/interfaces/menu.interface';
import {MenuService} from 'wlc-engine/modules/menu/system/services/menu.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {BodyClassService} from 'wlc-engine/modules/core/system/services/body-class/body-class.service';

import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as Config from 'wlc-engine/modules/menu/system/config/sticky-footer.items';
import * as Params from './sticky-footer.params';

@Component({
    selector: '[wlc-sticky-footer]',
    templateUrl: './sticky-footer.component.html',
    styleUrls: ['./styles/sticky-footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class StickyFooterComponent extends AbstractComponent implements OnInit, OnDestroy {

    public override $params: Params.IStickyFooterCParams;
    public menuParams: MenuParams.IMenuCParams;

    protected useIcons: boolean;
    protected iconsFolder: string;
    protected menuConfig: MenuParams.MenuConfigItem[];
    protected menuSettings: IMenuOptions;
    protected isAuth: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IStickyFooterCParams,
        configService: ConfigService,
        protected menuService: MenuService,
        protected eventService: EventService,
        protected bodyClassService: BodyClassService,
        protected translate: TranslateService,
        cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.IStickyFooterCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
            cdr,
        );
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.initEventHandlers();
        await this.initConfig();
        this.initMenu();
        this.bodyClassService.addModifier('wlc-body--sticky-footer');
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        this.bodyClassService.removeClassByPrefix('wlc-body--sticky-footer');
    }

    protected initMenu(): void {
        this.useIcons = _has(this.$params, 'common.icons.use')
            ? this.$params.common.icons.use
            : this.configService.get<boolean>('$menu.stickyFooter.icons.use');

        this.iconsFolder = this.menuSettings?.iconsPack ||
            this.$params.common?.icons?.folder ||
            this.configService.get<string>('$menu.stickyFooter.icons.folder');

        const extension: TIconExtension = this.configService.get<TIconExtension>('$menu.stickyFooter.icons.extension');
        if (extension) {
            _set(this.$params, 'menuParams.common.icons.extension', extension);
        }

        this.$params.menuParams.items = MenuHelper.parseMenuConfig(this.menuConfig, Config.wlcStickyFooterItemsGlobal, {
            icons: {
                folder: this.iconsFolder,
                disable: !this.useIcons,
            },
        });
        this.$params.menuParams = _cloneDeep(this.$params.menuParams);
        this.cdr.detectChanges();
    }

    protected async initConfig(): Promise<void> {
        this.menuSettings = await this.menuService.getFundistMenuSettings('stickyFooter');

        if (this.menuSettings) {
            this.menuConfig = MenuHelper.parseMenuSettings(
                this.menuSettings, 'sticky-footer', this.translate.currentLang,
                {
                    isAuth: this.isAuth,
                    wlcElementPrefix: 'link_sticky-footer-nav-',
                });
        } else {
            this.menuConfig = this.configService.get<MenuParams.MenuConfigItem[]>('$menu.stickyFooter.items');
        }
    }

    protected initEventHandlers(): void {
        this.eventService.subscribe([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
        ], () => {
            this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
            this.cdr.detectChanges();
        }, this.$destroy);
    }
}
