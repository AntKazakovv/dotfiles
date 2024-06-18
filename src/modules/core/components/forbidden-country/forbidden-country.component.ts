import {
    Component,
    Inject,
    ChangeDetectionStrategy,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core';

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
    ) {
        super({
            injectParams: params,
            defaultParams: Params.defaultParams,
        });
    }
}
