import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    EventService,
    IMixedParams,
} from 'wlc-engine/modules/core';

import {CaptchaService} from 'wlc-engine/modules/security/captcha/system/services/captcha/captcha.service';

import * as Params from './captcha.params';

@Component({
    selector: '[wlc-captcha]',
    templateUrl: './captcha.component.html',
    styleUrls: ['./styles/captcha.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptchaComponent extends AbstractComponent implements OnInit {
    public override $params: Params.ICaptchaCParams;
    public imageUrl: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICaptchaCParams,
        protected eventService: EventService,
        protected captchaService: CaptchaService,
    ) {
        super(
            <IMixedParams<Params.ICaptchaCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
        );
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.imageUrl = this.captchaService.captchaImageUrl;
        this.setSubscription();
    }

    protected setSubscription(): void {
        this.eventService.subscribe<string>(
            {name: 'CAPTCHA_ERROR'},
            (url: string): void => {
                this.imageUrl = url;
                this.cdr.markForCheck();
            },
            this.$destroy,
        );
    }

}
