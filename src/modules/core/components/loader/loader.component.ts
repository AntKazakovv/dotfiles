import {
    Component,
    OnInit,
    Inject,
    Self,
    Optional,
    Input,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import * as Params from './loader.params';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-loader]',
    templateUrl: './loader.component.html',
    styleUrls: ['./styles/loader.component.scss'],
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
    }

    public get ringType(): boolean {
        return this.$params.type === 'ring' || this.$params.type === 'ring-with-logo';
    }
}
