import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {
    MenuHelper,
    MenuParams,
    MenuConfig,
} from 'wlc-engine/modules/menu';

import * as Params from './affiliates-menu.params';

import _clone from 'lodash-es/clone';
import _filter from 'lodash-es/filter';

@Component({
    selector: '[wlc-affiliates-menu]',
    templateUrl: './affiliates-menu.component.html',
    styleUrls: ['./styles/affiliates-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AffiliatesMenuComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IAffiliatesMenuCParams;

    public $params: Params.IAffiliatesMenuCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAffiliatesMenuCParams,
        protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.initConfig();
    }

    protected initConfig(): void {

        this.$params.menuParams.items = MenuHelper.parseMenuConfig(
            this.configService.get<MenuParams.MenuConfigItem[]>('$menu.affiliatesMenu.items'),
            MenuConfig.wlcAffiliatesMenuItemsGlobal,
        );

        if (!this.configService.get<boolean>('$base.affiliate.useTestimonials')) {
            this.$params.menuParams.items = _filter(
                this.$params.menuParams.items, (item: MenuParams.IMenuItem): boolean => {
                    return item.class !== 'testimonials';
                });
        }

        this.$params.menuParams = _clone(this.$params.menuParams);
    }
}
