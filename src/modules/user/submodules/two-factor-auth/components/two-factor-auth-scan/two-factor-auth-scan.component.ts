import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {
    AbstractComponent,
    IInputCParams,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    ITwoFactorAuthResponse,
} from 'wlc-engine/modules/user/submodules/two-factor-auth/system/interfaces/two-factor-auth.interface';
import {
    TwoFactorAuthService,
} from 'wlc-engine/modules/user/submodules/two-factor-auth/system/services/two-factor-auth/two-factor-auth.service';

import * as Params from './two-factor-auth-scan.params';

@Component({
    selector: '[wlc-two-factor-auth-scan]',
    templateUrl: './two-factor-auth-scan.component.html',
    styleUrls: ['./styles/two-factor-auth-scan.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoFactorAuthScanComponent extends AbstractComponent implements OnInit {

    @Input() public inlineParams: Params.ITwoFactorAuthScanCParams;
    @Input() public secretCode: ITwoFactorAuthResponse;
    public override $params: Params.ITwoFactorAuthScanCParams;
    public inputParams: IInputCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITwoFactorAuthScanCParams,
        cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected twoFactorAuthService: TwoFactorAuthService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, null, cdr);
    }

    public get imgUrl(): string {
        return ('https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=') + this.secretCode.path;
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.secretCode ??= this.$params.secretCode || this.twoFactorAuthService.secretCode;
        this.inputParams = this.getInputParams();
        this.cdr.markForCheck();
    }

    protected openModal(): void {
        this.modalService.showModal('two-factor-auth-finish');
    }

    protected getInputParams(): IInputCParams {
        return {
            name: 'secretCode',
            theme: 'vertical',
            common: {
                readonly: true,
                placeholder: gettext('Code'),
                customModifiers: 'right-shift',
            },
            clipboard: true,
            control: new UntypedFormControl(this.secretCode.secret),
        };
    }
}
