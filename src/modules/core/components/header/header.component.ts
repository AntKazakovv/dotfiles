import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';

import * as Params from './header.params';

/**
 * Outputs disclaimer text
 *
 * @example
 *
 * {
 *     name: 'core.wlc-header',
 * }
 *
 */
@Component({
    selector: '[wlc-header]',
    templateUrl: './header.component.html',
    styleUrls: ['./styles/header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IHeaderCParams;
    public override $params: Params.IHeaderCParams;
    public config: Params.IHeaderConfig;

    constructor(
        @Inject('injectParams') protected params: Params.IHeaderCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.config = this.$params.config;
    }
}
