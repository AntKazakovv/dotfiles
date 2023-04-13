import {
    Component,
    OnInit,
    Inject,
    Input,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core';

import * as Params from './iframe-deposit.params';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-iframe-deposit]',
    templateUrl: './iframe-deposit.component.html',
    styleUrls: ['./styles/iframe-deposit.component.scss'],
})
export class IframeDepositComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: Params.IFrameDepositCParams;

    public override $params: Params.IFrameDepositCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IFrameDepositCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
