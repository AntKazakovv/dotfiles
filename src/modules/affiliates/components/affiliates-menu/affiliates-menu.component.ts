import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';

import _clone from 'lodash-es/clone';
import _filter from 'lodash-es/filter';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {
    MenuHelper,
    MenuParams,
} from 'wlc-engine/modules/menu';
import {wlcAffiliatesMenuItemsGlobal} from 'wlc-engine/modules/affiliates/system/config/affiliates-menu.items.config';

import * as Params from './affiliates-menu.params';

@Component({
    selector: '[wlc-affiliates-menu]',
    templateUrl: './affiliates-menu.component.html',
    styleUrls: ['./styles/affiliates-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AffiliatesMenuComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IAffiliatesMenuCParams;

    public override $params: Params.IAffiliatesMenuCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAffiliatesMenuCParams,
        configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.initConfig();
    }

    protected initConfig(): void {

        this.$params.menuParams.items = MenuHelper.parseMenuConfig(
            this.configService.get<MenuParams.MenuConfigItem[]>('$menu.affiliatesMenu.items'),
            wlcAffiliatesMenuItemsGlobal,
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
