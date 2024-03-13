import {
    Component,
    OnInit,
    Inject,
    Self,
    Optional,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import * as Params from './loader.params';

@Component({
    selector: '[wlc-loader]',
    templateUrl: './loader.component.html',
    styleUrls: ['./styles/loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.ILoaderCParams;
    @Input() public type: Params.Type;
    public override $params: Params.ILoaderCParams;

    constructor(
        @Self()
        @Optional()
        @Inject('injectParams')
        protected injectParams: Params.ILoaderCParams,
        configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.ILoaderCParams>>{
                injectParams: injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        if (!this.type) {
            this.type = this.$params.type;
        }
    }
}
