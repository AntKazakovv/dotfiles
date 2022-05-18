import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
    OnDestroy,
} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DateTime} from 'luxon';

import _isEqual from 'lodash-es/isEqual';
import _keys from 'lodash-es/keys';
import _merge from 'lodash-es/merge';
import _has from 'lodash-es/has';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    ModalService,
    IIndexing,
} from 'wlc-engine/modules/core';
import {
    HistoryFilterFormComponent,
    IHistoryFilterFormCParams,
} from './history-filter-form/history-filter-form.component';
import {
    HistoryFilterService,
} from 'wlc-engine/modules/finances/system/services/history-filter/history-filter.service';
import {
    IFilterValue,
    IFinancesFilter,
} from 'wlc-engine/modules/finances/system/interfaces/history-filter.interface';
import {
    IFormWrapperCParams,
    IFormComponent,
} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

import * as Params from './history-filter.params';

@Component({
    selector: '[wlc-history-filter]',
    templateUrl: './history-filter.component.html',
    styleUrls: ['./styles/history-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryFilterComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Params.IHistoryFilterCParams;

    public $params: Params.IHistoryFilterCParams;
    public isFiltered: boolean = false;
    protected formData: BehaviorSubject<IFinancesFilter | IFilterValue> = new BehaviorSubject(null);
    protected defaultFormData: IFinancesFilter | IFilterValue;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IHistoryFilterCParams,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected historyFilterService: HistoryFilterService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.subscriber();
    }

    public ngOnDestroy(): void {
        if (this.modalService.getActiveModal('history-filter')) {
            this.modalService.hideModal('history-filter');
        }
    }

    public ngSubmit(form: FormGroup): void {
        this.historyFilterService.setFilter(this.$params.config, form.value);
        this.modalService.hideModal('history-filter');
    }

    public openFilter(): void {

        this.modalService.showModal({
            id: 'history-filter',
            modifier: 'history-filter',
            component: HistoryFilterFormComponent,
            componentParams: <IHistoryFilterFormCParams>{
                formConfig: this.createFormConfig(),
                onSubmit: this.ngSubmit.bind(this),
                formData: this.formData,
            },
            size: 'md',
            showFooter: false,
        });
    }

    protected subscriber(): void {
        this.historyFilterService.getFilter(this.$params.config)
            .pipe(takeUntil(this.$destroy))
            .subscribe((data: IIndexing<any>) => {
                this.checkFilter(data);

                if (data) {
                    this.formData.next(data);
                }
            });
    }

    protected checkFilter(data: IIndexing<any>): void {
        if (!data) {
            return;
        }
        this.defaultFormData = this.historyFilterService.getDefaultFilter(this.$params.config);
        this.isFiltered = !_keys(this.defaultFormData)
            .every((key: string): boolean => {
                if (this.defaultFormData[key] instanceof DateTime) {
                    return this.defaultFormData[key].toFormat('y-LL-dd') ===  data[key].toFormat('y-LL-dd');
                }
                return _isEqual(this.defaultFormData[key], data[key]);
            });
        this.cdr.markForCheck();
    }

    protected createFormConfig(): IFormWrapperCParams {
        const isIFinancesFilter = (formData: IFinancesFilter | IFilterValue): formData is IFinancesFilter => {
            return _has(formData, 'startDate') || _has(formData, 'endDate');
        };
        const formData: IFinancesFilter | IFilterValue = this.formData.getValue() || this.defaultFormData;
        let formConfig = Params.formConfig[this.$params.config];
        
        if (!this.formData.getValue()) {
            this.formData.next(this.defaultFormData);
        }

        if (isIFinancesFilter(formData) && (formData.endDate || formData.startDate)) {
            const startIndex = formConfig.components
                .findIndex((input: IFormComponent) => input.params.name === 'startDate');
            const endIndex = formConfig.components
                .findIndex((input: IFormComponent) => input.params.name === 'endDate');

            if (formData.startDate && startIndex + 1) {
                const {day, month, year} = formData.endDate.plus({day: 1}).toObject();
                formConfig = _merge({}, formConfig, {
                    components: formConfig.components
                        .map((el: IFormComponent, i: number) => i === startIndex
                            ? _merge({}, el, {
                                params: {
                                    datepickerOptions: {
                                        markDates: [{
                                            dates: [formData.startDate.toObject()],
                                            styleClass: 'defaultDate',
                                        }],
                                        disableSince: {day, month, year},
                                    },
                                },
                            })
                            : el,
                        ),
                });
            }

            if (formData.endDate && endIndex + 1) {
                const {day, month, year} = formData.startDate.minus({day: 1}).toObject();
                formConfig = _merge({}, formConfig, {
                    components: formConfig.components
                        .map((el: IFormComponent, i: number) => i === endIndex
                            ? _merge({}, el, {
                                params: {
                                    datepickerOptions: {
                                        markDates: [{
                                            dates: [formData.endDate.toObject()],
                                            styleClass: 'defaultDate',
                                        }],
                                        disableUntil: {day, month, year},
                                    },
                                },
                            })
                            : el,
                        ),
                });
            }
        }

        return formConfig;
    }
}
