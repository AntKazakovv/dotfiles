import {Component, Inject, OnInit} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService, IMixedParams} from 'wlc-engine/modules/core';
import * as Params from './error-page.params';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-error-page]',
    templateUrl: './error-page.component.html',
    styleUrls: ['./styles/error-page.component.scss'],
})
export class ErrorPageComponent extends AbstractComponent implements OnInit {

    public override $params: Params.IErrorPageCParams;
    public links: Params.LinkType[] = [];

    constructor(
        @Inject('injectParams') protected params: Params.IErrorPageCParams,
        configService: ConfigService,
    ) {
        super(<IMixedParams<any>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.links = this.$params.links?.slice(0, 2);
    }
}
