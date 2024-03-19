import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Inject,
    Input,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';

import * as Params from './withdraw-info.params';

@Component({
    selector: '[wlc-withdraw-info]',
    templateUrl: './withdraw-info.component.html',
    styleUrls: ['./styles/withdraw-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class WithdrawInfoComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IWithdrawInfoCParams;
    @Input() public currency: string = 'EUR';
    @Input() public totalAmount: number = 0;
    @Input() public availableAmount: number = 0;

    public override $params: Params.IWithdrawInfoCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IWithdrawInfoCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
