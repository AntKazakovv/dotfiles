import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
    Input,
} from '@angular/core';
import {
    DomSanitizer,
    SafeUrl,
} from '@angular/platform-browser';

import {AbstractComponent} from 'wlc-engine/modules/core';

import * as Params from './iframe-deposit.params';

@Component({
    selector: '[wlc-iframe-deposit]',
    templateUrl: './iframe-deposit.component.html',
    styleUrls: ['./styles/iframe-deposit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IframeDepositComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: Params.IFrameDepositCParams;

    public override $params: Params.IFrameDepositCParams;
    public url: SafeUrl;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IFrameDepositCParams,
        protected sanitizer: DomSanitizer,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.$params.src) {
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.$params.src);
        }
    }
}
