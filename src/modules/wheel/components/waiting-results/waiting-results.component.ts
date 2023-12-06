import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
} from '@angular/core';

import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    ModalService,
} from 'wlc-engine/modules/core';
import {ILottieAnimationCParams} from 'wlc-engine/modules/core/components/lottie-animation/lottie-animation.params';

import * as Params from './waiting-results.params';

@Component({
    selector: '[wlc-waiting-results]',
    templateUrl: './waiting-results.component.html',
    styleUrls: ['./styles/waiting-results.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class WaitingResultsComponent extends AbstractComponent implements OnInit {
    public override $params: Params.IWaitingResultsCParams;
    public animationParams: ILottieAnimationCParams = Params.animationParams;

    constructor(
        @Inject('injectParams') protected params: Params.IWaitingResultsCParams,
        configService: ConfigService,
        protected modalService: ModalService,
    ) {
        super(<IMixedParams<Params.IWaitingResultsCParams>>{
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
    }

    protected close(): void {
        this.modalService.hideModal('waiting-results');
    }
}
