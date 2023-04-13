import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';

import * as Params from './icon-exp-lp-description.params';

@Component({
    selector: '[wlc-icon-exp-lp]',
    templateUrl: './icon-exp-lp-description.component.html',
    styleUrls: ['./styles/icon-exp-lp-description.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconExpLpDescriptionComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.IIconExpLpDescriptionCParams;
    public siteName: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IIconExpLpDescriptionCParams,
        configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.siteName = this.configService.get('$base.site.name');
    }
}
