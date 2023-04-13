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
    GlobalHelper,
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
    @Input() public loading: boolean = false;
    public override $params: Params.INoContentCParams;

    public get bgImage(): string {
        return this.$params.bgImage ? `url('${GlobalHelper.proxyUrl(this.$params.bgImage)}')` : '';
    }

    constructor(
        @Inject('injectParams') protected injectParams: Params.INoContentCParams,
        configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        if (this.$params.parentComponentClass) {
            this.addModifiers(this.$params.parentComponentClass);
        }
    }
}
