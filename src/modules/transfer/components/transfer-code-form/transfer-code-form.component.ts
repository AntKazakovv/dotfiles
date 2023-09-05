import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import * as Params from './transfer-code-form.params';

export {ITransferCodeFormCParams} from './transfer-code-form.params';

@Component({
    selector: '[wlc-transfer-code-form]',
    templateUrl: './transfer-code-form.component.html',
    styleUrls: ['./styles/transfer-code-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TransferCodeFormComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ITransferCodeFormCParams;

    public override $params: Params.ITransferCodeFormCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITransferCodeFormCParams,
        configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
