import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import {RawParams} from '@uirouter/core';
import {takeUntil} from 'rxjs/operators';
import {
    AbstractComponent,
    ConfigService,
    ActionService,
    DeviceType,
    ModalService,
} from 'wlc-engine/modules/core';
import {StaticService, TextDataModel} from 'wlc-engine/modules/static';

import * as Params from './promo-steps.params';

import _isObject from 'lodash-es/isObject';
import _filter from 'lodash-es/filter';
import _isUndefined from 'lodash-es/isUndefined';

export interface IStep {
    title: string;
    desc: string;
    sref?: string;
    srefparams?: string;
    href?: string;
    modal?: string;
}

@Component({
    selector: '[wlc-promo-steps]',
    templateUrl: './promo-steps.component.html',
    styleUrls: ['./styles/promo-steps.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoStepsComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IPromoStepsCParams;

    public $params: Params.IPromoStepsCParams;
    public ready: boolean = false;
    public deviceType: DeviceType;
    public steps: IStep[] = [];
    protected activeStep: number = 0;
    protected showErrors: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPromoStepsCParams,
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected staticService: StaticService,
        protected cdr: ChangeDetectorRef,
        protected actionService: ActionService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.deviceType = this.actionService.getDeviceType();

        try {
            const data: TextDataModel = await this.staticService.getPost('promo-steps');

            if (!data.extFields?.acf?.steps) {
                return;
            }

            this.steps = _filter(data.extFields.acf.steps, (step: IStep) => step.title && step.desc);
            this.subscribeDeviceChange();
            this.ready = true;
            this.cdr.detectChanges();
        } catch (error) {
            //
        }
    }

    /**
     * Getting step type
     * @param step {IStep} - promo step
     * @returns {string} - type promo step
     */
    public getStepType(step: IStep): string {
        if (step.sref) {
            return 'sref';
        } else if (step.href) {
            return 'href';
        } else if (step.modal) {
            return 'modal';
        } else {
            return 'default';
        }
    }

    /**
     * Getting ui-params from step 
     * From JSON ui-params to object
     * @param srefParams {string} - ui-router params from WP
     * @returns {RawParams} - ui-router params
     */
    public getSrefParams(srefParams: string): RawParams {
        try {
            return JSON.parse(srefParams);
        } catch (error) {
            return {};
        }
    }

    /**
     * Check active step
     * @param index {number} - index promo step
     * @returns {boolean}
     */
    public isActiveStep(index: number): boolean {
        return index === this.activeStep;
    }

    /**
     * Open modal
     * @param name {string} - modal name
     */
    public showModal(name: string): void {
        this.modalService.showModal(name);
    }

    /**
     * Select active step
     * @param index {number} - index promo step
     */
    public selectTab(index: number): void {
        this.activeStep = index;
        this.cdr.detectChanges();
    }

    protected subscribeDeviceChange(): void {
        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                this.deviceType = type;
                this.cdr.markForCheck();
            });
    }
}
