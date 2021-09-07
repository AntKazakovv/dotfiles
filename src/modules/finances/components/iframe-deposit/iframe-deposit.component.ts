import {
    Component,
    OnInit,
    Inject,
    Input,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core';

import * as Params from './iframe-deposit.params';

@Component({
    selector: '[wlc-iframe-deposit]',
    templateUrl: './iframe-deposit.component.html',
    styleUrls: ['./styles/iframe-deposit.component.scss'],
})
export class IframeDepositComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: Params.IFrameDepositCParams;

    public $params: Params.IFrameDepositCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IFrameDepositCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
