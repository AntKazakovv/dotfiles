import {
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {
    ConfigService,
    IMixedParams,
} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';

import * as Params from './offline-page.params';

@Component({
    selector: '[wlc-offline-page]',
    templateUrl: './offline-page.component.html',
    styleUrls: ['./styles/offline-page.component.scss'],
})
export class OfflinePageComponent extends AbstractComponent implements OnInit {

    public $params: Params.IOfflinePageCParams;

    constructor(
        @Inject('injectParams') protected params: Params.IOfflinePageCParams,
        protected configService: ConfigService,
    ) {
        super(<IMixedParams<any>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }
}
