import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core';

import * as Params from './recaptcha-policy.params';

/**
 * Outputs text with Privacy Policy and Terms of Service links
 *
 * @example
 *
 * {
 *     name: 'recaptcha.wlc-recaptcha-policy',
 * }
 *
 */
@Component({
    selector: '[wlc-recaptcha-policy]',
    templateUrl: './recaptcha-policy.component.html',
    styleUrls: ['./styles/recaptcha-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecaptchaPolicyComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IRecaptchaPolicyCParams;
    public override $params: Params.IRecaptchaPolicyCParams;
    public useRecaptcha: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IRecaptchaPolicyCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.useRecaptcha = this.configService.get<boolean>('appConfig.useRecaptcha');
    }
}
