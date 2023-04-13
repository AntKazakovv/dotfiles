import {
    Component,
    Inject,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';

import * as Params from './forbidden-country.params';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-forbidden-country]',
    templateUrl: './forbidden-country.component.html',
    styleUrls: ['./styles/forbidden-country.component.scss'],
})
export class ForbiddenCountryComponent extends AbstractComponent {
    public override $params: Params.IForbiddenCountryParams;

    constructor(
        @Inject('injectParams') protected params: Params.IForbiddenCountryParams,
        configService: ConfigService,
    ) {
        super({
            injectParams: params,
            defaultParams: Params.defaultParams,
        }, configService);
    }
}
