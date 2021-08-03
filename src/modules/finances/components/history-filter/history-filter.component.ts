import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

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
    IFormWrapperCParams,
    IFormComponent,
} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';

import * as Params from './history-filter.params';

import _isEqual from 'lodash-es/isEqual';
import _keys from 'lodash-es/keys';
import _merge from 'lodash-es/merge';

@Component({
    selector: '[wlc-history-filter]',
    templateUrl: './history-filter.component.html',
    styleUrls: ['./styles/history-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryFilterComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IHistoryFilterCParams;

    public $params: Params.IHistoryFilterCParams;
    public isFiltered: boolean = false;

    protected formData: BehaviorSubject<IIndexing<any>> = new BehaviorSubject(null);

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
        if (!data) { return; }
        const defaultData = this.historyFilterService.getDefaultFilter(this.$params.config);
        this.isFiltered = !_keys(defaultData).every((key: string) => _isEqual(defaultData[key], data[key]));
        this.cdr.markForCheck();
    }

    protected createFormConfig(): IFormWrapperCParams {
        let formConfig = Params.formConfig[this.$params.config];
        const defaultFormData = this.historyFilterService.getDefaultFilter(this.$params.config);

        if (!this.formData.getValue()) {
            this.formData.next(defaultFormData);
        }

        if (defaultFormData.endDate || defaultFormData.startDate) {
            const startIndex = formConfig.components.findIndex((input: IFormComponent) => input.params.name === 'startDate');
            const endIndex = formConfig.components.findIndex((input: IFormComponent) => input.params.name === 'endDate');

            if (defaultFormData.startDate && startIndex + 1) {
                formConfig = _merge({}, formConfig, {
                    components: formConfig.components.map((el: IFormComponent, i: number) => i === startIndex ? _merge({}, el, {
                        params: {
                            datepickerOptions: {
                                markDates: [{
                                    dates: [defaultFormData.startDate.c],
                                    styleClass: 'defaultDate',
                                }],
                            },
                        },
                    }) : el),
                });
            }

            if (defaultFormData.endDate && endIndex + 1) {
                formConfig = _merge({}, formConfig, {
                    components: formConfig.components.map((el: IFormComponent, i: number) => i === endIndex ? _merge({}, el, {
                        params: {
                            datepickerOptions: {
                                markDates: [{
                                    dates: [defaultFormData.endDate.c],
                                    styleClass: 'defaultDate',
                                }],
                            },
                        },
                    }) : el),
                });
            }
        }

        return formConfig;
    }

}
