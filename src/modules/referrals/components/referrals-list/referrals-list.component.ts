import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    inject,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {
    BehaviorSubject,
    distinctUntilKeyChanged,
    map,
    merge,
    skip,
    takeUntil,
} from 'rxjs';

import _merge from 'lodash-es/merge';

import {
    AbstractComponent,
    ISelectCParams,
    IWrapperCParams,
} from 'wlc-engine/modules/core';

import {IRefDateFilter} from 'wlc-engine/modules/referrals/system/interfaces/referrals.interface';
import {RefItemModel} from 'wlc-engine/modules/referrals/system/models/ref-item.model';
import {
    IReferralsListController,
    ReferralsListController,
} from '../../system/classes/referrals-list.controller';

import * as Params from './referrals-list.params';

@Component({
    selector: '[wlc-referrals-list]',
    templateUrl: './referrals-list.component.html',
    styleUrls: ['./styles/referrals-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ReferralsListController],
})

export class ReferralsListComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IReferralsListCParams;

    public override $params: Params.IReferralsListCParams;
    public isListExpanded: boolean = false;
    public referralItems: RefItemModel[] = [];
    public monthSelect: ISelectCParams = {
        name: 'months',
        updateOnControlChange: true,
        labelText: gettext('Report by month'),
        disabled: false,
        control: new UntypedFormControl(),
        items: [],
    };
    public yearSelect: ISelectCParams = {
        name: 'years',
        updateOnControlChange: true,
        labelText: null,
        disabled: false,
        control: new UntypedFormControl(),
        items: [],
    };

    private _controller: IReferralsListController = inject(ReferralsListController);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IReferralsListCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this._controller.init(this.$params);
        this.setFilters();
    }

    public get monthProfit(): number {
        return this._controller?.totalProfitSum || 0;
    }

    public get filterInterval(): string {
        return this._controller?.filterInterval || '';
    }

    public get profitReferralsCount(): number {
        return this._controller?.profitReferralsCount || 0;
    }

    public get showAllText(): string {
        return this.isListExpanded ? gettext('Show less') : gettext('Show all');
    }

    public get showMoreBtn(): boolean {
        return this.profitReferralsCount > this.$params.rowsLimit;
    }

    public get emptyDataConfig(): IWrapperCParams {
        return this.$params.emptyConfig;
    }

    public get filtersReady$(): BehaviorSubject<boolean> {
        return this._controller.filtersReady$;
    }

    public get referralsList$(): BehaviorSubject<RefItemModel[]> {
        return this._controller.referralsList$;
    }

    public toggleRows(): void {
        this.isListExpanded = !this.isListExpanded;
        this._controller.toggleRows();
    }

    private setFilters(): void {
        this.monthSelect = _merge(this.monthSelect, <ISelectCParams>{
            items: this._controller.monthsFilterItems,
            value: this._controller.currentMonth,
        });
        this.yearSelect = _merge(this.yearSelect, <ISelectCParams>{
            items: this._controller.yearFilterItems,
            value: this._controller.currentYear,
        });

        merge(
            this.yearSelect.control.valueChanges
                .pipe(
                    skip(1),
                    map((value: string): IRefDateFilter => ({field: 'year', value}))),
            this.monthSelect.control.valueChanges
                .pipe(
                    skip(1),
                    map((value: string): IRefDateFilter => ({field: 'month', value}))),
        )
            .pipe(
                distinctUntilKeyChanged<IRefDateFilter>('value'),
                takeUntil(this.$destroy))
            .subscribe((data: IRefDateFilter): void => {
                this._controller.updateFilters(data);
            });
    }
}
