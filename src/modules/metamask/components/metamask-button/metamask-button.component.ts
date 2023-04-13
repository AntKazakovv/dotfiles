import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {MetamaskService} from 'wlc-engine/modules/metamask/system/services/metamask/metamask.service';

import * as Params from './metamask-button.params';

@Component({
    selector: '[wlc-metamask-button]',
    templateUrl: './metamask-button.component.html',
    styleUrls: ['./styles/metamask-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MetamaskButtonComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IMetamaskButtonCParams;

    public override $params: Params.IMetamaskButtonCParams;

    protected metamaskService: MetamaskService;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMetamaskButtonCParams,
        configService: ConfigService,
        protected injectionService: InjectionService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    /**
     * Handle click by button
     */
    public async clickHandler(): Promise<void> {
        if (!this.metamaskService) {
            this.metamaskService = await this.injectionService.getService<MetamaskService>('metamask.metamask-service');
        }

        this.metamaskService.transaction(this.$params.paymentMessage);
    }
}
