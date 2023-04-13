import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
    OnDestroy,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';
import {
    filter,
    takeUntil,
} from 'rxjs/operators';
import {DateTime} from 'luxon';
import _isEqual from 'lodash-es/isEqual';
import _keys from 'lodash-es/keys';
import _merge from 'lodash-es/merge';
import _has from 'lodash-es/has';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {
    HistoryFilterService,
} from 'wlc-engine/modules/core/system/services/history-filter/history-filter.service';
import {
    IHistoryFilterValue,
    IHistoryFilter,
} from 'wlc-engine/modules/core/system/interfaces/history-filter.interface';
import {
    IFormWrapperCParams,
    IFormComponent,
} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {
    HistoryFilterFormComponent,
    IHistoryFilterFormCParams,
} from './history-filter-form/history-filter-form.component';

import * as Params from './history-filter.params';

@Component({
    selector: '[wlc-history-filter]',
    templateUrl: './history-filter.component.html',
    styleUrls: ['./styles/history-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryFilterComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Params.IHistoryFilterCParams;

    public override $params: Params.IHistoryFilterCParams;
    public isFiltered: boolean = false;
    protected formData: BehaviorSubject<IHistoryFilter | IHistoryFilterValue> = new BehaviorSubject(null);
    protected defaultFormData: IHistoryFilter | IHistoryFilterValue;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IHistoryFilterCParams,
        configService: ConfigService,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected historyFilterService: HistoryFilterService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.subscriber();
    }

    public override ngOnDestroy(): void {
        if (this.modalService.getActiveModal('history-filter')) {
            this.modalService.hideModal('history-filter');
        }
    }

    public ngSubmit(form: UntypedFormGroup): void {
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
            .pipe(
                filter((data: IIndexing<unknown>) => !!data),
                takeUntil(this.$destroy),
            )
            .subscribe((data: IIndexing<any>) => {
                this.checkFilter(data);
                this.formData.next(data);
            });
    }

    protected checkFilter(data: IIndexing<any>): void {
        this.defaultFormData = this.historyFilterService.getDefaultFilter(this.$params.config);
        this.isFiltered = !_keys(this.defaultFormData)
            .every((key: string): boolean => {
                if (this.defaultFormData[key] instanceof DateTime) {
                    return this.defaultFormData[key].toFormat('y-LL-dd') === data[key].toFormat('y-LL-dd');
                }
                return _isEqual(this.defaultFormData[key], data[key]);
            });
        this.cdr.markForCheck();
    }

    protected createFormConfig(): IFormWrapperCParams {
        const isHistoryFilter = (formData: IHistoryFilter | IHistoryFilterValue): formData is IHistoryFilter => {
            return _has(formData, 'startDate') || _has(formData, 'endDate');
        };
        const formData: IHistoryFilter | IHistoryFilterValue = this.formData.getValue() || this.defaultFormData;
        let formConfig = Params.formConfig[this.$params.config];

        if (!this.formData.getValue()) {
            this.formData.next(this.defaultFormData);
        }

        if (isHistoryFilter(formData) && (formData.endDate || formData.startDate)) {
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
                                        alignSelectorRight: true,
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
