import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
} from '@angular/core';

import {
    BehaviorSubject,
    takeUntil,
} from 'rxjs';

import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
    AbstractComponent,
    IMixedParams,
    ModalService,
} from 'wlc-engine/modules/core';
import {ILottieAnimationCParams} from 'wlc-engine/modules/core/components/lottie-animation/lottie-animation.params';
import {WheelService} from 'wlc-engine/modules/wheel/system/services/wheel.service';

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
    public showButtonResults$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        @Inject('injectParams') protected params: Params.IWaitingResultsCParams,
        protected modalService: ModalService,
        protected wheelService: WheelService,
    ) {
        super(<IMixedParams<Params.IWaitingResultsCParams>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        if (this.$params.animation.use) {
            this.animationParams = _merge(
                _cloneDeep(Params.animationParams),
                this.$params.animation.params,
            );
        }
        this.timerStartHttpResponse();
    }

    protected close(): void {
        this.modalService.hideModal('waiting-results');
    }

    protected timerStartHttpResponse(): void {
        if (this.wheelService.getUserWheel().isStreamer) {
            setTimeout(() => {
                this.wheelService.getWinnersFromHttp();
            }, 5000);
        } else {
            setTimeout(() => {
                this.showButtonResults$.next(true);
                this.subscribeStateButton();
            }, 10000);
        }
    }

    protected subscribeStateButton(): void {
        this.wheelService.showButtonResults$.pipe(takeUntil(this.$destroy))
            .subscribe((value): void => {
                this.showButtonResults$.next(value);
            });
    }

    protected takeResults(): void {
        this.showButtonResults$.next(false);
        this.wheelService.getWinnersFromHttp();
    }
}
