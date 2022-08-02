import {
    Component,
    Inject,
    OnInit,
    Input,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import * as Params from './recaptcha-policy.params';

/**
 * Outputs text with Privacy Policy and Terms of Service links
 *
 * @example
 *
 * {
 *     name: 'core.wlc-recaptcha-policy',
 * }
 *
 */
@Component({
    selector: '[wlc-recaptcha-policy]',
    templateUrl: './recaptcha-policy.component.html',
    styleUrls: ['./styles/recaptcha-policy.component.scss'],
})
export class RecaptchaPolicyComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IRecaptchaPolicyCParams;
    public $params: Params.IRecaptchaPolicyCParams;
    public useRecaptcha: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IRecaptchaPolicyCParams,
        protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.useRecaptcha = this.configService.get<boolean>('appConfig.useRecaptcha');
    }
}
