import {
    Component,
    Inject,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Input,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';

import * as Params from './loyalty-level.params';

@Component({
    selector: '[wlc-loyalty-level]',
    templateUrl: './loyalty-level.component.html',
    styleUrls: ['./styles/loyalty-level.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyLevelComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.ILoyaltyLevelCParams;

    public override $params: Params.ILoyaltyLevelCParams;
    public levelTitle: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyLevelCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.$params.titleAs) {
            this.levelTitle = this.$params.name;
        }
    }
}
