import {
    Component,
    OnInit,
    Inject,
    Self,
    Optional,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core';
import {
    ConfigService,
} from 'wlc-engine/modules/core/system/services';
import * as Params from './loader.params';

@Component({
    selector: '[wlc-loader]',
    templateUrl: './loader.component.html',
    styleUrls: ['./styles/loader.component.scss'],
})
export class LoaderComponent extends AbstractComponent implements OnInit {
    public $params: Params.ILoaderCParams;

    constructor(
        @Self()
        @Optional()
        @Inject('injectParams')
        protected injectParams: Params.ILoaderCParams,
        protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }
}
