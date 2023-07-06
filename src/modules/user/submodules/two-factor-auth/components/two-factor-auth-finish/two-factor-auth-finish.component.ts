import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';

import {
    AbstractComponent,
    IFormWrapperCParams,
} from 'wlc-engine/modules/core';
import {
    TwoFactorAuthService,
} from 'wlc-engine/modules/user/submodules/two-factor-auth/system/services/two-factor-auth/two-factor-auth.service';

import * as Params from './two-factor-auth-finish.params';

@Component({
    selector: '[wlc-two-factor-auth-finish]',
    templateUrl: './two-factor-auth-finish.component.html',
    styleUrls: ['./styles/two-factor-auth-finish.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoFactorAuthFinishComponent extends AbstractComponent implements OnInit {

    @Input() public inlineParams: Params.ITwoFactorAuthFinishCParams;
    public override $params: Params.ITwoFactorAuthFinishCParams;
    public errors$: BehaviorSubject<Record<string, string>> = new BehaviorSubject(null);
    public config: IFormWrapperCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITwoFactorAuthFinishCParams,
        cdr: ChangeDetectorRef,
        protected twoFactorAuthService: TwoFactorAuthService,

    ) {
        super({injectParams, defaultParams: Params.defaultParams}, null, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
    }

    public async ngSubmit(form: UntypedFormGroup): Promise<boolean> {
        const securityCode: string = form.value.securityCode;
        form.disable();
        const res = await this.twoFactorAuthService.enable2faGoogle(securityCode);
        form.enable();
        return res;
    }
}
