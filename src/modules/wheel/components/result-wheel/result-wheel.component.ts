import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
} from 'wlc-engine/modules/core';
import {ParticipantModel} from 'wlc-engine/modules/wheel/system/models';

import {ILottieAnimationCParams} from 'wlc-engine/modules/core/components/lottie-animation/lottie-animation.params';
import {IParticipantItemCParams} from
    'wlc-engine/modules/wheel/components/participant-item/participant-item.params';

import * as Params from './result-wheel.params';

@Component({
    selector: '[wlc-result-wheel]',
    templateUrl: './result-wheel.component.html',
    styleUrls: ['./styles/result-wheel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultWheelComponent extends AbstractComponent implements OnInit {

    public override $params!: Params.IResultWheelCParams;
    public animationParams: ILottieAnimationCParams = Params.animationParams;
    protected winners$: BehaviorSubject<ParticipantModel[]> = new BehaviorSubject([]);

    constructor(
        @Inject('injectParams') protected params: Params.IResultWheelCParams,
        configService: ConfigService,
    ) {
        super(<IMixedParams<Params.IResultWheelCParams>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        if (this.$params.animation.use) {
            this.animationParams = _merge(
                _cloneDeep(Params.animationParams),
                this.$params.animation.params,
            );
        }

        if (this.$params.winners.length === 3 || this.$params.winners.length === 4) {
            this.addModifiers('small-illustration');
        }

        if (this.$params.winners.length <= 4) {
            this.addModifiers('mini');
        }

        if (this.$params.winners.length > 4) {
            this.addModifiers('big-wins');
        }
        this.winners$.next(this.$params.winners);
    }

    protected getWinnerInlineParams(participant: ParticipantModel): IParticipantItemCParams {
        return {
            theme: 'winner',
            themeMod: 'winner',
            participant: participant,
        };
    }

    protected getDefaultInlineParams(participant: ParticipantModel): IParticipantItemCParams {
        return {
            theme: 'default',
            themeMod: 'default',
            participant: participant,
        };
    }
}
