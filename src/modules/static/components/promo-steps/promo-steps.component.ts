import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';

import {RawParams} from '@uirouter/core';
import {BehaviorSubject} from 'rxjs';
import {
    takeUntil,
    tap,
} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
    ActionService,
    DeviceType,
    ModalService,
    EventService,
} from 'wlc-engine/modules/core';
import {TextDataModel} from 'wlc-engine/modules/static/system/models/textdata.model';
import {StaticService} from 'wlc-engine/modules/static/system/services/static/static.service';

import * as Params from './promo-steps.params';

import _filter from 'lodash-es/filter';
import _sortBy from 'lodash-es/sortBy';
import _toNumber from 'lodash-es/toNumber';

export interface IStep {
    title: string;
    desc: string;
    sref?: string;
    srefparams?: string;
    href?: string;
    modal?: string;
    visibility?: 'all' | 'auth' | 'not-auth';
    order?: string | number;
    descriptionType?: Params.DescriptionType;
}

@Component({
    selector: '[wlc-promo-steps]',
    templateUrl: './promo-steps.component.html',
    styleUrls: ['./styles/promo-steps.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoStepsComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IPromoStepsCParams;

    public override $params: Params.IPromoStepsCParams;
    public ready: boolean = false;
    public deviceType: DeviceType;
    public steps: IStep[] = [];
    protected activeStep: number = 0;
    protected showErrors: boolean;
    private isAuth$: BehaviorSubject<boolean> = this.configService.get('$user.isAuth$');

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPromoStepsCParams,
        configService: ConfigService,
        protected modalService: ModalService,
        protected staticService: StaticService,
        cdr: ChangeDetectorRef,
        protected actionService: ActionService,
        protected eventService: EventService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.deviceType = this.actionService.getDeviceType();

        this.isAuth$.pipe(
            takeUntil(this.$destroy),
            tap(() => this.cdr.markForCheck()),
        ).subscribe();

        try {
            const data: TextDataModel = await this.staticService.getPost('promo-steps');

            if (!data.extFields?.acf?.steps) {
                return;
            }

            this.steps = _sortBy(
                _filter(data.extFields.acf.steps, (step: IStep) => step.title && step.desc),
                (step: IStep) => _toNumber(step.order),
            );

            this.subscribeDeviceChange();
            this.ready = true;
            this.cdr.detectChanges();
        } catch (error) {
            //
        }
    }

    /**
     * Return available promo steps
     */
    public get availableSteps(): IStep[] {
        return _filter(this.steps, step => {
            switch (step.visibility) {
                case 'all':
                    return true;
                case 'auth':
                    return this.isAuth$.getValue();
                case 'not-auth':
                    return !this.isAuth$.getValue();
                default:
                    return true;
            }
        });
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
     * Get class for styles link and visible arrow
     * @param step {IStep} - promo step
     * @returns {Params.DescriptionType} - class 'link' or 'action'
     */
    public getStepClassByType(step: IStep): Params.DescriptionType {
        return step.descriptionType || (this.getStepType(step) === 'modal' ? 'action' : 'link');
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
