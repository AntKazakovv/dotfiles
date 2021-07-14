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
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import * as Params from 'wlc-engine/modules/core/components/steps/steps.params';

import _entries from 'lodash-es/entries';
import _findIndex from 'lodash-es/findIndex';
import _map from 'lodash-es/map';
import _find from 'lodash-es/find';
import _filter from 'lodash-es/filter';
import _includes from 'lodash-es/includes';

@Component({
    selector: '[wlc-steps]',
    templateUrl: './steps.component.html',
    styleUrls: ['./styles/steps.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepsComponent extends AbstractComponent implements OnInit {

    @Input() public inlineParams: Params.IStepsParams;
    @Input() public themeMod: Params.ThemeMod;
    public $params: Params.IStepsParams;
    public currentStep: Params.IStep;
    public stepList: Params.IStep[];
    public noBackLink: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IStepsParams,
        protected eventService: EventService,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public ngOnInit(): void {
        this.themeMod = this.configService.get<string>('$base.profile.type') === 'first' ? 'first' : this.themeMod;
        super.ngOnInit();
        if (this.configService.get<boolean>('$base.profile.smsVerification.use')) {
            this.$params.stepsNames.push('signUpSmsVerify');
        }
        this.stepList = this.prepareSteps();

        this.currentStep = this.getStepParamByName(this.$params.startStepName) || this.getStepParamByName(this.$params.stepsNames[0]);

        this.setStepsCounters();
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
            this.setStepsCounters();
            this.cdr.markForCheck();
        }
    }

    protected previousStep(): void {
        const index = this.currentStepIndex();

        if (this.stepList[index - 1]) {
            this.currentStep = this.stepList[index - 1];
            this.setStepsCounters();
            this.cdr.markForCheck();
        }
    }

    protected getStepParamByName(stepName: string): any {
        return _find(this.stepList, ({name}) => name === stepName);
    }

    protected prepareSteps(): Params.IStep[] {
        const stepsConfig = this.configService.get<string>('$base.profile.type') === 'first' ?
            this.$params.stepsConfigFirst : this.$params.stepsConfig;
        const filteredEntriesConfig = _filter(_entries(stepsConfig), (value) => {
            return _includes(this.$params.stepsNames, value[0]);
        });
        return _map(filteredEntriesConfig, ([key, value]) => {
            return {
                name: key,
                config: value,
            };
        });
    }

    protected setStepsCounters(): void {
        this.configService.set<string>({
            name: 'regStepsCounter',
            value: (this.currentStepIndex() + 1) + '/' + this.stepList.length,
        });
        this.noBackLink = !this.currentStepIndex();
    }
}
