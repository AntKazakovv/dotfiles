import {
    Component,
    Inject,
    OnInit,
    ChangeDetectionStrategy,
    Input,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';

import * as Params from './loyalty-info.params';

@Component({
    selector: '[wlc-loyalty-info]',
    templateUrl: './loyalty-info.component.html',
    styleUrls: ['./styles/loyalty-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyInfoComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILoyaltyInfoCParams;

    public override $params: Params.ILoyaltyInfoCParams;
    public title!: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyInfoCParams,
        configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.title = this.$params.title ?? this.configService.get<string>('$loyalty.loyalty.programTitle');
    }
}
