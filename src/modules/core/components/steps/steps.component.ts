import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {
    AbstractComponent,
    EventService,
} from 'wlc-engine/modules/core';
import * as Params from 'wlc-engine/modules/core/components/steps/steps.params';

import {
    entries as _entries,
    find as _find,
    findIndex as _findIndex,
    map as _map,
} from 'lodash-es';

@Component({
    selector: '[wlc-steps]',
    templateUrl: './steps.component.html',
    styleUrls: ['./styles/steps.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepsComponent extends AbstractComponent implements OnInit {

    @Input() public inlineParams: Params.IStepsParams;
    public $params: Params.IStepsParams;
    public currentStep: Params.IStep;
    public stepList: Params.IStep[];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IStepsParams,
        protected eventService: EventService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.stepList = this.prepareSteps();

        this.currentStep = this.getStepParamByName(this.$params.startStepName);
        this.setSubscription();
    }

    protected setSubscription(): void {
        this.eventService.subscribe({name: Params.StepsEvents.Next}, () => {
            this.nextStep();
        }, this.$destroy);

        this.eventService.subscribe({name: Params.StepsEvents.Prev}, () => {
            this.previousStep();
        }, this.$destroy);
    }

    protected currentStepIndex(): number {
        const index = _findIndex(this.stepList, (step) => step.name === this.currentStep.name);
        return index >= 0 ? index : 0;
    }

    protected nextStep(): void {
        const index = this.currentStepIndex();

        if (this.stepList[index + 1]) {
            this.currentStep = this.stepList[index + 1];
            this.cdr.markForCheck();
        }
    }

    protected previousStep(): void {
        const index = this.currentStepIndex();

        if (this.stepList[index - 1]) {
            this.currentStep = this.stepList[index - 1];
            this.cdr.markForCheck();
        }
    }

    protected getStepParamByName(stepName: string): any {
        return _find(this.stepList, ({name}) => name === stepName);
    }

    protected prepareSteps(): Params.IStep[] {
        return _map(_entries(this.$params.stepsConfig), ([key, value]) => {
            return {
                name: key,
                config: value,
            };
        });
    }
}
