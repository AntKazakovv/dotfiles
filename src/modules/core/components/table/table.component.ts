import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    Input,
    ChangeDetectionStrategy,
    Injector,
} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {takeUntil} from 'rxjs/operators';
import {
    AbstractComponent,
    IMixedParams,
    InjectionService,
    ActionService,
    ConfigService,
    DeviceType,
    HeightToggleAnimation,
    TableAppearanceAnimation,
    IPaginateOutput,
} from 'wlc-engine/modules/core';
import {
    Currency,
    TableRowModel,
} from './table-row.model';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './table.params';

import _each from 'lodash-es/each';
import _filter from 'lodash-es/filter';
import _isObject from 'lodash-es/isObject';
import _uniq from 'lodash-es/uniq';
import _sortBy from 'lodash-es/sortBy';

@Component({
    selector: '[wlc-table]',
    templateUrl: './table.component.html',
    styleUrls: ['./styles/table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        ...TableAppearanceAnimation,
        ...HeightToggleAnimation,
    ],
})
export class TableComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: Params.ITableCParams;

    public override $params: Params.ITableCParams;
    public rows: TableRowModel[] = [];
    public paginatedRows: TableRowModel[] = [];
    public itemPerPage: number;
    public head: Params.ITableCol[] = [];
    public ready = false;
    public deviceType: DeviceType;
    public indexFactor: number = 0;
    public tableType: 'grid' | 'table' = 'grid';

    public theme: Params.Theme;
    public toggled: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.ITableCParams,
        protected injectionService: InjectionService,
        cdr: ChangeDetectorRef,
        protected injector: Injector,
        configService: ConfigService,
        protected actionService: ActionService,
        @Inject(WINDOW) protected window: Window,
    ) {
        super(
            <IMixedParams<Params.ITableCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        if (this.window.innerWidth >= this.$params.switchWidth) {
            this.tableType = 'table';
            this.addModifiers('table');
        }

        this.actionService.windowResize().pipe(takeUntil(this.$destroy)).subscribe({
            next: () => {
                if (this.window.innerWidth >= this.$params.switchWidth) {
                    this.tableType = 'table';
                    this.addModifiers('table');
                } else {
                    this.tableType = 'grid';
                    this.removeModifiers('table');
                }
            },
        });

        if (this.$params.pagination.use) {
            this.itemPerPage = this.$params.pageCount;
        }
        this.theme = this.$params.theme;
        this.prepareHead();
        if (this.$params.rows instanceof BehaviorSubject) {
            this.$params.rows.pipe(takeUntil(this.$destroy)).subscribe((rows) => {
                this.rows = this.createTableRow(rows);
                this.indexFactor = 0;
                this.paginationUseCheck();
                this.cdr.markForCheck();
            });
        } else {
            this.rows = this.createTableRow(this.$params.rows);
        }

        const columnWithComponent = _filter(this.head, (item) => item.type === 'component' && !item.componentClass);

        if (columnWithComponent?.length) {
            const componentsLoadPromises: Promise<unknown>[] = [];
            _uniq(columnWithComponent.map((item) => item.component)).forEach(async (component) => {
                componentsLoadPromises.push(
                    (async (): Promise<void> => {
                        const componentClass = await this.injectionService.loadComponent(component);
                        _each(columnWithComponent, (item) => {
                            if (item.component === component) {
                                item.componentClass = componentClass;
                            }
                        });
                    })(),
                );
                Promise.all(componentsLoadPromises).finally(() => {
                    this.ready = true;
                    this.cdr.markForCheck();
                });
            });
        } else {
            this.ready = true;
            this.cdr.markForCheck();
        }

        this.paginationUseCheck();
        this.setPaginatedRowsModifier();
        this.cdr.markForCheck();
        this.subscribeDeviceChange();
    }

    public getComponentInjector(item: TableRowModel, index: number, col: Params.ITableCol): Injector {
        if (!item.paramsInjector[col.key]) {
            const value = item.getValue(col, index) || {};
            item.paramsInjector[col.key] = Injector.create({
                providers: [
                    {
                        provide: 'injectParams',
                        useValue: _isObject(value) ? value : {value},
                    },
                ],
                parent: this.injector,
            });
        }
        return item.paramsInjector[col.key];
    }

    public animationStatus(col: Params.ITableCol, item: TableRowModel, first: boolean): string {
        return (col.disableHideClass || first) || item.opened || this.tableType === 'table' ? 'opened' : 'closed';
    }

    protected subscribeDeviceChange(): void {
        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                this.deviceType = type;
                this.cdr.markForCheck();
            });
    }

    protected setPaginatedRowsModifier(): void {
        this.addModifiers(`paginated-rows-${this.paginatedRows.length}`);
    }

    /**
     * Method updates the data when there was a change in `wlc-pagination` component
     *
     * @method paginationOnChange
     * @param {IPaginateOutput} value - $event output from `wlc-pagination` component
     */
    public paginationOnChange(value: IPaginateOutput): void {
        this.paginatedRows = value.paginatedItems as TableRowModel[];
        this.itemPerPage = value.event.itemsPerPage;
        this.actionService.scrollTo('body');
        this.indexFactor = (value.event.page - 1) * value.event.itemsPerPage;
        this.setPaginatedRowsModifier();
        this.cdr.detectChanges();
    }

    public toggleRows(): void {
        if (this.toggled) {
            this.paginatedRows = this.rows?.slice(0, this.itemPerPage);
        } else {
            this.paginatedRows = this.rows;
        }

        this.setPaginatedRowsModifier();
        this.toggled = !this.toggled;
    }

    protected getValue(item: string | Currency): string {
        return _isObject(item) ? item.value : item;
    }

    private createTableRow(rows: unknown[]): TableRowModel[] {
        return rows.map((row) => new TableRowModel(row, this.$params));
    }

    private paginationUseCheck(): void {
        if (!this.$params?.pagination.use) {
            this.paginatedRows = this.rows?.slice(0, this.itemPerPage);
        }
    }

    private prepareHead(): void {
        this.head = _sortBy(this.$params.head.map((item: Params.ITableCol) => {
            if (item.type === 'amount') {
                item.type = 'component';
                if (item.currencyUseIcon) {
                    item.component = 'core.wlc-wrapper';
                } else {
                    item.component = 'core.wlc-currency';
                }
            }
            item.order = item.order || Number.MAX_SAFE_INTEGER;
            return item;
        }), 'order');
    }
}
