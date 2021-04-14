import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';

import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';

import * as Params from './affiliates-menu.params';

@Component({
    selector: '[wlc-affiliates-menu]',
    templateUrl: './affiliates-menu.component.html',
    styleUrls: ['./styles/affiliates-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AffiliatesMenuComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IAffiliatesMenuCParams;

    public $params: Params.IAffiliatesMenuCParams;
    public menuConfig: MenuParams.IMenuCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAffiliatesMenuCParams,
        protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.menuConfig = {
            type: 'affiliates-menu',
            theme: this.$params.theme,
            themeMod: this.$params.themeMod,
        };

    }
}
