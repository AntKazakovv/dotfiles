import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core';

import * as Params from './lootbox-prize.params';

@Component({
    selector: '[wlc-lootbox-prize]',
    templateUrl: './lootbox-prize.component.html',
    styleUrls: ['./styles/lootbox-prize.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LootboxPrizeComponent extends AbstractComponent implements OnInit {

    public override $params: Params.ILootboxPrizeCParams;
    public isProfileFirst: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILootboxPrizeCParams,
    ) {
        super(
            <IMixedParams<Params.ILootboxPrizeCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            });
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.isProfileFirst = this.configService.get<string>('$base.profile.type') === 'first';
        this.$params.iconPath = this.$params.prize.imageOther
            || `//agstatic.com/bonuses/icons/lootbox.${this.configService.get<string>(
                '$bonuses.defaultIconExtension',
            )}`;
        this.prepareModifiers();
    }

    /**
     * Get bg image by profile
     *
     * @returns {string}
     */
    public get bgImage(): string {
        return this.isProfileFirst ? this.$params.prize.imageProfileFirst : this.$params.prize.image;
    }

    public get imagePromo(): string {
        return this.$params.prize.imagePromo;
    }

    public get prizeName(): string {
        return this.$params.prize.name;
    }

    public get iconPath(): string {
        return this.$params.iconPath;
    }

    protected prepareModifiers(): void {
        if (this.isProfileFirst) {
            this.addModifiers('with-image');
        }
    }
}
