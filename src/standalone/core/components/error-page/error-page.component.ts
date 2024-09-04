import {
    Component,
    Inject,
    OnInit,
    ChangeDetectionStrategy,
} from '@angular/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IMixedParams} from 'wlc-engine/modules/core';
import * as Params from './error-page.params';

@Component({
    selector: '[wlc-error-page]',
    templateUrl: './error-page.component.html',
    styleUrls: ['./styles/error-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CoreModule,
    ],
})
export class ErrorPageComponent extends AbstractComponent implements OnInit {

    public override $params: Params.IErrorPageCParams;
    public links: Params.LinkType[] = [];

    constructor(
        @Inject('injectParams') protected params: Params.IErrorPageCParams,
    ) {
        super(<IMixedParams<any>>{injectParams: params, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.links = this.$params.links?.slice(0, 2);
    }
}
