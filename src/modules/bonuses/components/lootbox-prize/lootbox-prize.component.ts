import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
} from 'wlc-engine/modules/core';

import * as Params from './lootbox-prize.params';

@Component({
    selector: '[wlc-lootbox-prize]',
    templateUrl: './lootbox-prize.component.html',
    styleUrls: ['./styles/lootbox-prize.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LootboxPrizeComponent extends AbstractComponent implements OnInit {

    public $params: Params.ILootboxPrizeCParams;
    public isProfileFirst: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILootboxPrizeCParams,
        protected configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.ILootboxPrizeCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.isProfileFirst = this.configService.get<string>('$base.profile.type') === 'first';
        this.$params.iconPath = `/bonuses/icons/lootbox.${this.ConfigService.get<string>(
            '$bonuses.defaultIconExtension')}`;
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

    protected prepareModifiers(): void {
        if (this.isProfileFirst) {
            this.addModifiers('with-image');
        }
    }
}
