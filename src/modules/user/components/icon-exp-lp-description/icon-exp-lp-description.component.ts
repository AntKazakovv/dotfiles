import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';

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
        protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.siteName = this.configService.get('$base.site.name');
    }
}
