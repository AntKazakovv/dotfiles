import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core';

import * as Params from './top-rated.params';

@Component({
    selector: '[wlc-top-rated]',
    templateUrl: './top-rated.component.html',
    styleUrls: ['./styles/top-rated.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopRatedComponent extends AbstractComponent {
    public override $params: Params.ITopRatedCParams;

    constructor(
        public elementRef: ElementRef,
        @Inject('injectParams') protected injectParams: Params.ITopRatedCParams,
    ) {
        super(
            <IMixedParams<Params.ITopRatedCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
        );
    }
}
