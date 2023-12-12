import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    InjectionService,
    ICheckboxCParams,
} from 'wlc-engine/modules/core';

import {
    GAME_RECOMMENDED_DONT_SHOW,
    GAME_RECOMMENDED_STORAGE_TYPE,
} from 'wlc-engine/modules/games/system/constants/game-recommended.constants';

import * as Params from './game-recommended.params';

@Component({
    selector: '[wlc-game-recommended]',
    templateUrl: './game-recommended.component.html',
    styleUrls: ['./styles/game-recommended.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameRecommendedComponent extends AbstractComponent implements OnInit {

    public override $params: Params.IGameRecommendedCParams;
    public dontShowAgainBtn: ICheckboxCParams = {
        themeMod: 'bold',
        name: 'dont-show',
        textSide: 'right',
        control: new UntypedFormControl(),
        onChange: (checked: boolean) => {
            this.configService.set({
                name: GAME_RECOMMENDED_DONT_SHOW,
                value: checked,
                storageType: GAME_RECOMMENDED_STORAGE_TYPE,
            });
        },
    };

    constructor(
        @Inject('injectParams') protected injectParams: Params.IGameRecommendedCParams,
        configService: ConfigService,
        protected injectionService: InjectionService,
    ) {
        super(
            <IMixedParams<Params.IGameRecommendedCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.dontShowAgainBtn.text = this.$params.dontShowCheckbox.text;
    }
}
