import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {first} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    IEvent,
    IIndexing,
} from 'wlc-engine/modules/core';
import {IMGAConfig} from 'wlc-engine/modules/core/components/license/license.params';
import {UserHelper} from 'wlc-engine/modules/user/system/helpers/user.helper';

import * as Params from 'wlc-engine/modules/core/components/steps/steps.params';

import _entries from 'lodash-es/entries';
import _findIndex from 'lodash-es/findIndex';
import _map from 'lodash-es/map';
import _find from 'lodash-es/find';
import _filter from 'lodash-es/filter';
import _includes from 'lodash-es/includes';
import {CustomHook} from 'wlc-engine/modules/core/system/decorators/hook.decorator';

@Component({
    selector: '[wlc-steps]',
    templateUrl: './steps.component.html',
    styleUrls: ['./styles/steps.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepsComponent extends AbstractComponent implements OnInit {

    @Input() public inlineParams: Params.IStepsParams;
    @Input() public themeMod: Params.ThemeMod;
    public override $params: Params.IStepsParams;
    public currentStep: Params.IStep;
    public stepList: Params.IStep[];
    public noBackLink: boolean;
    protected isSkipBonus: boolean;
    protected usePromoBanner: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IStepsParams,
        protected eventService: EventService,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, cdr);

        this.isSkipBonus = this.configService.get<boolean>('$base.registration.skipBonusStep');
        this.usePromoBanner = this.configService.get<boolean>('$base.registration.usePromoBanner');
    }

    public override ngOnInit(): void {
        this.setThemeMod();
        super.ngOnInit();
        if (this.configService.get<IMGAConfig>('$modules.core.components["wlc-license"].mga')
            || this.configService.get<string>('appConfig.license') === 'romania'
        ) {
            this.$params.stepsNames.push('signUpFormTwoSteps');
        }

        if (this.configService.get<boolean>('$base.profile.smsVerification.use')) {
            this.$params.stepsNames.push('signUpSmsVerify');
        }

        if (this.configService.get<boolean>('$base.registration.usePromoBanner')) {
            this.$params.stepsNames.push('signUpWithPromoBanner');
        }

        if (this.isSkipBonus) {
            this.skipBonus();
        }

        this.stepList = this.prepareSteps();

        const startStepName: string = this.configService.get('promoCode')
            ? this.$params.promoStepName
            : this.$params.startStepName;

        this.currentStep = this.getStepParamByName(startStepName)
            || this.getStepParamByName(this.$params.stepsNames[0]);

        this.setStepsCounters();
        this.setSubscription();
    }

    @CustomHook('core', 'setSubscriptionSteps')
    protected setSubscription(): void {
        this.eventService.subscribe({name: Params.StepsEvents.Next}, () => {
            this.nextStep();
        }, this.$destroy);

        this.eventService.subscribe({name: Params.StepsEvents.Prev}, () => {
            this.previousStep();
        }, this.$destroy);

        this.eventService.subscribe({name: 'hide.bs.modal'}, (name: string) => {
            if (name === 'signup') {
                this.configService.set<object>({
                    name: 'regFormData',
                    value: {},
                });
            }
        }, this.$destroy);

        if (this.$params.stepsNames.includes('signUpBonuses')) {
            this.eventService.filter({name: 'EMPTY_REGISTER_BONUSES'}, this.$destroy)
                .pipe(first())
                .subscribe((data: IEvent<boolean>) => {
                    if (data.data){
                        this.eventService.emit({name: Params.StepsEvents.Next});
                    } else if (this.stepList.length > 1 ) {
                        UserHelper.restrictRegistration(this.configService, this.eventService);
                    }
                });
        }
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
        const stepsConfig = this.getStepsConfig();
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

    protected getStepsConfig(): IIndexing<Params.IStepConfig> {
        if (this.isSkipBonus) {
            return this.$params.stepsConfigWithoutBonus;
        } else {
            return this.configService.get<string>('$base.profile.type') === 'first' ?
                this.$params.stepsConfigFirst : this.$params.stepsConfig;
        }
    }

    protected setStepsCounters(): void {
        if (this.stepList.length > 1) {
            this.configService.set<string>({
                name: 'regStepsCounter',
                value: (this.currentStepIndex() + 1) + '/' + this.stepList.length,
            });
        }
        this.noBackLink = !this.currentStepIndex();
    }

    protected skipBonus(): void {
        const signUpBonusesIndex = this.$params.stepsNames.indexOf('signUpBonuses');
        this.usePromoBanner ? this.$params.stepsNames.splice(signUpBonusesIndex, 2)
            : this.$params.stepsNames.splice(signUpBonusesIndex, 1);
    }

    protected setThemeMod(): void {

        if (this.isSkipBonus) {
            this.themeMod = this.usePromoBanner ? 'with-promo' : 'skip-bonus';
        } else {
            this.themeMod = this.configService.get<string>('$base.profile.type') === 'first' ?
                'first' : this.themeMod;
        }
    }
}
