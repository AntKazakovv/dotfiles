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

import * as Params from './two-factor-auth-code.params';

@Component({
    selector: '[wlc-two-factor-auth-code]',
    templateUrl: './two-factor-auth-code.component.html',
    styleUrls: ['./styles/two-factor-auth-code.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoFactorAuthCodeComponent extends AbstractComponent implements OnInit {

    @Input() public inlineParams: Params.ITwoFactorAuthCodeCParams;
    @Input() public authKey: string;
    public override $params: Params.ITwoFactorAuthCodeCParams;
    public errors$: BehaviorSubject<Record<string, string>> = new BehaviorSubject(null);
    public config: IFormWrapperCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITwoFactorAuthCodeCParams,
        cdr: ChangeDetectorRef,
        protected twoFactorAuthService: TwoFactorAuthService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, null, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.authKey ??= this.$params.authKey;
    }

    /**
     * Sends request to complete email verification for unauthorized user
     *
     * @param {FormGroup} form
     */
    public async ngSubmit(form: UntypedFormGroup): Promise<boolean> {
        const code2FA: string = form.value.code2FA;
        form.disable();
        const res = await this.twoFactorAuthService.login2faGoogle(this.authKey, code2FA);
        form.enable();
        return res;
    }
}
