import {
    ChangeDetectionStrategy,
    Component,
    Inject,
} from '@angular/core';

import {WINDOW} from 'wlc-engine/modules/app/system';
import {IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';

import * as Params from './something-wrong-page.params';

@Component({
    selector: '[wlc-something-wrong-page]',
    templateUrl: './something-wrong-page.component.html',
    styleUrls: ['./styles/something-wrong-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SomethingWrongPageComponent extends AbstractComponent {

    public override $params: Params.ISomethingWrongPageCParams;

    constructor(
        @Inject('injectParams') protected params: Params.ISomethingWrongPageCParams,
        @Inject(WINDOW) protected window: Window,
    ) {
        super(<IMixedParams<any>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        });
    }

    /** Reload the page using the window method */
    public reloadPage(): void {
        this.window.location.reload();
    }
}
