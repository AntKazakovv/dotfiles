import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';

import * as Params from './bonus-choice-modal.params';

@Component({
    selector: '[wlc-bonus-choice-modal]',
    templateUrl: './bonus-choice-modal.component.html',
    styleUrls: ['./styles/bonus-choice-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonusChoiceModalComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IBonusChoiceModalCParams;

    public override $params: Params.IBonusChoiceModalCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBonusChoiceModalCParams,
        configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
