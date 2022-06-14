import {
    Component,
    Inject,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';

import * as Params from './forbidden-country.params';

@Component({
    selector: '[wlc-forbidden-country]',
    templateUrl: './forbidden-country.component.html',
    styleUrls: ['./styles/forbidden-country.component.scss'],
})
export class ForbiddenCountryComponent extends AbstractComponent {
    public $params: Params.IForbiddenCountryParams;

    constructor(
        @Inject('injectParams') protected params: Params.IForbiddenCountryParams,
        protected configService: ConfigService,
    ) {
        super({
            injectParams: params,
            defaultParams: Params.defaultParams,
        }, configService);
    }
}
