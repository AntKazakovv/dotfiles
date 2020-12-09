import {
    Component,
    Inject,
    OnInit,
    Input,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import * as Params from './copyright.params';

/**
 * Outputs copyright text
 *
 * @example
 *
 * {
 *     name: 'promo.wlc-copyright',
 * }
 *
 */
@Component({
    selector: '[wlc-copyright]',
    templateUrl: './copyright.component.html',
    styleUrls: ['./styles/copyright.component.scss'],
})
export class CopyrightComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ICopyrightCParams;
    public $params: Params.ICopyrightCParams;
    public siteName: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICopyrightCParams,
        protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.siteName = this.configService.get<string>('$base.site.name');
    }
}
