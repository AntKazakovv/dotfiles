import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
} from 'wlc-engine/modules/core';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';

import * as Params from './bonus-modal.params';

@Component({
    selector: '[wlc-bonus-modal]',
    templateUrl: './bonus-modal.component.html',
    styleUrls: ['./styles/bonus-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonusModalComponent extends AbstractComponent implements OnInit {
    public bonus: Bonus;
    public override $params: Params.IBonusModalCParams;
    public bonusBgUrl: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBonusModalCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.IBonusModalCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.bonus = this.$params.bonus;

        if (this.configService.get<boolean>('$bonuses.useNewImageSources')) {
            this.bonusBgUrl = this.bonus.imageDescription ? `url(${this.bonus.imageDescription})`: '';
        } else {
            this.bonusBgUrl = this.bonus.imageOther ? `url(${this.bonus.imageOther})` : '';
        }

        if (this.bonus.showOnly) {
            this.addModifiers('show-only');
        }
    }
}
