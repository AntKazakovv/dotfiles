import {
    Component,
    Inject,
    OnInit,
    ChangeDetectionStrategy,
    Input,
} from '@angular/core';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';

import * as Params from './loyalty-levels-wp.params';

@Component({
    selector: '[wlc-loyalty-levels-wp]',
    templateUrl: './loyalty-levels-wp.component.html',
    styleUrls: ['./styles/loyalty-levels-wp.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyLevelsWpComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.ILoyaltyLevelWpParams;
    @Input() public hideDescription: boolean;
    @Input() public hideInfo: boolean;

    public override $params: Params.ILoyaltyLevelWpParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyLevelWpParams,
        configService: ConfigService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(GlobalHelper.prepareCParams(this, ['hideDescription', 'hideInfo']));
    }

    public get showDescription(): boolean {
        return !this.$params.hideDescription;
    }

    public get showInfo(): boolean {
        return !this.$params.hideInfo;
    }
}
