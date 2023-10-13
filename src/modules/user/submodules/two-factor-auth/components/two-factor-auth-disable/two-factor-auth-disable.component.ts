import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';

import * as Params from './two-factor-auth-disable.params';

@Component({
    selector: '[wlc-two-factor-auth-disable]',
    templateUrl: './two-factor-auth-disable.component.html',
    styleUrls: ['./styles/two-factor-auth-disable.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoFactorAuthDisableComponent extends AbstractComponent implements OnInit {

    @Input() public inlineParams: Params.ITwoFactorAuthDisableCParams;
    public override $params: Params.ITwoFactorAuthDisableCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITwoFactorAuthDisableCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
    }
}
