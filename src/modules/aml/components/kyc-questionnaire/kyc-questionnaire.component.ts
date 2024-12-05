import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';
import _merge from 'lodash-es/merge';
import _uniq from 'lodash-es/uniq';
import _isString from 'lodash-es/isString';

import {
    AbstractComponent,
    DataService,
    IFormWrapperCParams,
    ModalService,
    EventService,
    NotificationEvents,
    IPushMessageParams,
} from 'wlc-engine/modules/core';

import * as Params from './kyc-questionnaire.params';

@Component({
    selector: '[wlc-kyc-questionnaire]',
    templateUrl: './kyc-questionnaire.component.html',
    styleUrls: ['./styles/kyc-questionnaire.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class KycQuestionnaireComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IKycQuestionnaireCParams;

    public override $params: Params.IKycQuestionnaireCParams;
    public step!: number;
    public stepsTotal!: number;
    public activeStepConfig$: BehaviorSubject<IFormWrapperCParams> = new BehaviorSubject(null);
    public form!: FormGroup;

    protected stepKey$: BehaviorSubject<string> = new BehaviorSubject(null);
    protected stepsData: Map<any, Record<string, any>> = new Map();
    protected formData: BehaviorSubject<Record<string, string>> = new BehaviorSubject({});

    constructor(
        @Inject('injectParams') protected injectParams: Params.IKycQuestionnaireCParams,
        protected modalService: ModalService,
        protected dataService: DataService,
        protected eventService: EventService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.stepsTotal = _uniq(Object.keys(this.$params.steps)
            .map(k => parseInt(k))).length;

        this.step = parseInt(Object.keys(this.$params.steps)[0]);

        // @ts-ignore no-implicit-any #672571
        this.activeStepConfig$.next(this.$params.steps[this.step]);
    }

    /**
     * Back button handler
     */
    public goBack(): void {
        this.nextStep(false);
    }

    /**
     * Form submit handler
     */
    public async submitHandler(): Promise<boolean> {
        this.formData.next(_merge({}, this.formData.getValue(), this.form.getRawValue()));

        const last: boolean = this.nextStep();

        if (last) {
            const data: Record<string, any> = _merge({}, ...this.stepsData.values());
            return await this.sendData(data);
        } else {
            return true;
        }
    }

    /**
     * Close modal handler
     */
    public closeModal(): void {
        if (this.modalService.getActiveModal('kyc-questionnaire')) {
            this.modalService.hideModal('kyc-questionnaire');
        }
    }

    /**
     * Gets FormGroup from form-wrapper
     */
    public getForm(form: FormGroup): void {
        this.form = form;
    }

    /**
     * Emits step change
     * @param foreword step change direction. `true` (by default) - move foreword, `false` - move backwards
     * @returns `true` if steps ends
     */
    public nextStep(foreword: boolean = true): boolean {
        this.saveStepInfo();

        const next: number = this.step + (foreword ? 1 : -1);

        if (next < 1 || next > this.stepsTotal) {
            return true;
        }

        let stepKeyConfig: string = String(next);

        // @ts-ignore no-implicit-any #672571
        if (this.$params.stepsRelations?.[next]) {
            // @ts-ignore no-implicit-any #672571
            const name: string = this.$params.stepsRelations[next];
            const value: string = this.formData.getValue()[name];

            stepKeyConfig += `:${name}:${value}`;
        }

        // @ts-ignore no-implicit-any #672571
        if (!this.$params.steps[stepKeyConfig]) {
            console.error('step does not exist: ', stepKeyConfig);
        }

        this.step = next;
        // @ts-ignore no-implicit-any #672571
        this.activeStepConfig$.next(this.$params.steps[stepKeyConfig]);

        return false;
    }

    protected saveStepInfo(): void {
        const step: number = this.step;

        if (this.stepsData.has(step)) {
            this.stepsData.delete(step);
        }

        this.stepsData.set(step, this.form.value);
    }

    protected async sendData(data: Record<string, any>): Promise<boolean> {

        for (let i in data) {
            if (!_isString(data[i])) {
                data[i] = data[i].toString();
            }
        }

        try {
            this.form.disable();
            await this.dataService.request({
                name: 'kycform',
                system: 'kyc',
                url: '/kycform',
                type: 'POST',
                events: {
                    success: 'KYC_FORM_SEND',
                },
            }, data);

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Form submitted successfully'),
                    message: gettext('Your questionnaire has been successfully sent'),
                },
            });
            return true;
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Form submitting error'),
                    message: error.errors ?? gettext('An error occurred during the questionnaire sending'),
                },
            });
            return false;
        } finally {
            this.form.enable();
            this.closeModal();
        }
    }
}
