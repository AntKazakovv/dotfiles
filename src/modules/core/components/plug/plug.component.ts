import {
    Component,
    Inject,
    OnInit,
    Input,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes';
import * as Params from './plug.params';

/**
 * Component stub
 *
 * @example
 *
 * {
 *     name: 'core.wlc-plug',
 * }
 *
 */
@Component({
    selector: '[wlc-plug]',
    templateUrl: './plug.component.html',
    styleUrls: ['./styles/plug.component.scss'],
})
export class PlugComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IPlugCParams;
    public $params: Params.IPlugCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPlugCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
