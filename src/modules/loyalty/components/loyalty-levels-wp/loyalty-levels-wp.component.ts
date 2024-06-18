import {
    Component,
    Inject,
    OnInit,
    ChangeDetectionStrategy,
    Input,
} from '@angular/core';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';

import * as Params from './loyalty-levels-wp.params';

@Component({
    selector: '[wlc-loyalty-levels-wp]',
    templateUrl: './loyalty-levels-wp.component.html',
    styleUrls: ['./styles/loyalty-levels-wp.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyLevelsWpComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILoyaltyLevelsWpCParams;
    @Input() public hideDescription: boolean;
    @Input() public hideInfo: boolean;

    public override $params: Params.ILoyaltyLevelsWpCParams;
    public noDataInfo: boolean = false;
    public noDataDescription: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoyaltyLevelsWpCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareCParams(this, ['hideDescription', 'hideInfo']));
        this.$params.loyaltyDescriptionPost.components[0].params =
            {
                ...this.$params.loyaltyDescriptionPost.components[0].params as {},
                noDataCallback: () => this.noDataDescription = true,
            };
        this.$params.loyaltyInfoPost.components[0].params =
        {
            ...this.$params.loyaltyInfoPost.components[0].params as {},
            noDataCallback: () => this.noDataInfo = true,
        };
    }

    public get showDescription(): boolean {
        return !this.$params.hideDescription && !this.noDataDescription;
    }

    public get showInfo(): boolean {
        return !this.$params.hideInfo && !this.noDataInfo;
    }
}
