import {
    ChangeDetectionStrategy,
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
    public override $params: Params.ITwoFactorAuthCodeCParams;
    public errors$: BehaviorSubject<Record<string, string>> = new BehaviorSubject(null);
    public config: IFormWrapperCParams;
    public pending$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITwoFactorAuthCodeCParams,
        protected twoFactorAuthService: TwoFactorAuthService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        if (this.$params.type === 'finish') {
            this.$params.description = Params.finishDescription;
        }

        this.setFormConfig();
    }

    public async ngSubmit(form: UntypedFormGroup): Promise<boolean> {
        const code2FA: string = form.value.code2FA;
        form.disable();
        this.pending$.next(true);
        let result: boolean = false;

        switch (this.$params.type) {
            case 'finish':
                result = await this.twoFactorAuthService.enable2FAGoogle(code2FA);
                break;
            default:
                result = await this.twoFactorAuthService.enter2FAGoogleCode(
                    this.$params.authKey,
                    code2FA,
                    this.$params.responseCode,
                );
                break;
        }
        this.pending$.next(false);
        form.enable();
        return result;
    }

    protected setFormConfig(): void {
        this.config = {
            components: [
                ...Params.components(this.pending$),
            ],
        };
    }
}
