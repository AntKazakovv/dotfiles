import {
    OnInit,
    Inject,
    Component,
    ChangeDetectionStrategy,
    Input,
} from '@angular/core';
import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';

import * as Params from './no-content.params';

@Component({
    selector: '[wlc-no-content]',
    templateUrl: './no-content.component.html',
    styleUrls: ['./styles/no-content.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlcNoContentComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.INoContentCParams;
    public $params: Params.INoContentCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.INoContentCParams,
        protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        if (this.$params.parentComponentClass) {
            this.addModifiers(this.$params.parentComponentClass);
        }
    }
}
