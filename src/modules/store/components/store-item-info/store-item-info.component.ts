import {
    ChangeDetectionStrategy,
    Component,
    Inject,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
} from 'wlc-engine/modules/core';

import * as Params from './store-item-info.params';

@Component({
    selector: '[wlc-store-item-info]',
    templateUrl: './store-item-info.component.html',
    styleUrls: ['./styles/store-item-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreItemInfoComponent extends AbstractComponent {
    public $params: Params.IStoreItemInfoCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IStoreItemInfoCParams,
        protected configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.IStoreItemInfoCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }
}
