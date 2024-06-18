import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Inject,
    OnInit,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {
    AbstractComponent,
    IMixedParams,
    InjectionService,
    ICheckboxCParams,
} from 'wlc-engine/modules/core';

import {
    dontShowRecommendedGames,
    dontShowRecommendedGamesStorage,
} from 'wlc-engine/modules/games/system/constants/recommended-games.constants';

import * as Params from './recommended-games.params';

@Component({
    selector: '[wlc-recommended-games]',
    templateUrl: './recommended-games.component.html',
    styleUrls: ['./styles/recommended-games.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendedGamesComponent extends AbstractComponent implements OnInit {

    public override $params: Params.IRecommendedGamesCParams;
    public dontShowAgainBtn: ICheckboxCParams = {
        themeMod: 'bold',
        name: 'dont-show',
        textSide: 'right',
        control: new UntypedFormControl(),
        onChange: (checked: boolean) => {
            this.configService.set({
                name: dontShowRecommendedGames,
                value: checked,
                storageType: dontShowRecommendedGamesStorage,
            });
        },
    };

    protected readonly injectionService = inject(InjectionService);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IRecommendedGamesCParams,
    ) {
        super(
            <IMixedParams<Params.IRecommendedGamesCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            });
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.dontShowAgainBtn.text = this.$params.dontShowCheckbox.text;
    }
}
