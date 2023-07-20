import {
    Component,
    Inject,
    ChangeDetectionStrategy,
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
    changeDetection: ChangeDetectionStrategy.OnPush,
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
