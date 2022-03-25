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
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus';

import * as Params from './bonus-modal.params';

@Component({
    selector: '[wlc-bonus-modal]',
    templateUrl: './bonus-modal.component.html',
    styleUrls: ['./styles/bonus-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonusModalComponent extends AbstractComponent implements OnInit {
    public bonus: Bonus;
    public $params: Params.IBonusModalCParams;
    public iconPath: string;
    public fallbackIconPath: string;
    public bonusBgUrl: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBonusModalCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.IBonusModalCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.bonus = this.$params.bonus;
        this.iconPath = `${this.$params.iconsPath}${this.bonus.viewTarget}.${this.$params.iconType}`;
        this.fallbackIconPath = `${this.$params.fallback?.IconsPath +
            this.bonus.viewTarget}.${this.$params.fallback?.iconType}`;
        this.bonusBgUrl = this.bonus.imageOther ? `url(${this.bonus.imageOther})` : `url(${this.$params.bgImage})`;
    }

    /**
     * Updating the icon to replace it
     */
    public iconError(): void {
        this.cdr.detectChanges();
    }
}
