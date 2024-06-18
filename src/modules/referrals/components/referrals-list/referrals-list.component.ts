import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    OnDestroy,
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
    SelectValuesService,
} from 'wlc-engine/modules/core';

import {IRefDateFilter} from 'wlc-engine/modules/referrals/system/interfaces/referrals.interface';
import {RefItemModel} from 'wlc-engine/modules/referrals/system/models/ref-item.model';
import {ReferralsService} from 'wlc-engine/modules/referrals/system/services/referrals.service';
import {ReferralsListController} from 'wlc-engine/modules/referrals/system/classes/referrals-list.controller';

import * as Params from './referrals-list.params';

@Component({
    selector: '[wlc-referrals-list]',
    templateUrl: './referrals-list.component.html',
    styleUrls: ['./styles/referrals-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ReferralsListComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Params.IReferralsListCParams;

    public listReady$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public filtersReady$: BehaviorSubject<boolean> = new BehaviorSubject(false);
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

    private refListController: ReferralsListController;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IReferralsListCParams,
        protected referralsService: ReferralsService,
        protected selectValuesService: SelectValuesService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        await this.configService.ready;

        this.refListController = new ReferralsListController(
            this.referralsService,
            this.selectValuesService,
            this.$params,
        );

        this.initFilters();
        this.initSubscribers();
    }

    public override ngOnDestroy(): void {
        this.refListController.destroy();
        this.$destroy.next();
        this.$destroy.complete();
    }

    public get monthProfit(): number {
        return this.refListController?.totalProfitSum || 0;
    }

    public get filterInterval(): string {
        return this.refListController?.filterInterval || '';
    }

    public get profitReferralsCount(): number {
        return this.refListController?.profitReferralsCount || 0;
    }

    public get showAllText(): string {
        return this.isListExpanded ? gettext('Show less') : gettext('Show all');
    }

    public get showMoreBtn(): boolean {
        return this.profitReferralsCount > this.$params.rowsLimit;
    }

    public toggleRows(): void {
        this.isListExpanded = !this.isListExpanded;
        this.refListController.toggleRows();
    }

    private initFilters(): void {

        this.monthSelect = _merge(this.monthSelect, <ISelectCParams>{
            items: this.refListController.monthsFilterItems,
            value: this.refListController.currentMonth,
        });

        this.yearSelect = _merge(this.yearSelect, <ISelectCParams>{
            items: this.refListController.yearFilterItems,
            value: this.refListController.currentYear,
        });

        merge(
            this.yearSelect.control.valueChanges.pipe(
                skip(1),
                map((value: string): IRefDateFilter => ({field: 'year', value})),
            ),
            this.monthSelect.control.valueChanges.pipe(
                skip(1),
                map((value: string): IRefDateFilter => ({field: 'month', value})),
            ),
        )
            .pipe(
                distinctUntilKeyChanged<IRefDateFilter>('value'),
                takeUntil(this.$destroy))
            .subscribe((data: IRefDateFilter): void => {
                this.refListController.updateFilters(data);
            });
    }

    private initSubscribers(): void {

        this.refListController.referralsList$.pipe(takeUntil(this.$destroy)).subscribe((list: RefItemModel[]) => {
            this.referralItems = list;
            this.cdr.markForCheck();
        });

        this.refListController.listReady$.pipe(takeUntil(this.$destroy)).subscribe((isReady: boolean) => {
            this.listReady$.next(isReady);
        });

        this.refListController.filtersReady$.pipe(takeUntil(this.$destroy)).subscribe((isReady: boolean) => {
            this.filtersReady$.next(isReady);
        });
    }
}
