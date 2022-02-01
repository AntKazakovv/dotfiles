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
import {
    animate,
    query,
    stagger,
    style,
    transition,
    trigger,
} from '@angular/animations';
import {takeUntil} from 'rxjs/operators';
import {
    AbstractComponent,
    IMixedParams,
    InjectionService,
    ActionService,
    ConfigService,
    DeviceType,
    HeightToggleAnimation,
    IPaginateOutput,
} from 'wlc-engine/modules/core';
import {TableRowModel} from './table-row.model';
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
        trigger('tableAppearance', [
            transition('* <=> *', [
                query(':enter', [
                    style({opacity: 0, transform: 'translateX(-35px)'}),
                    stagger('0.2s', animate('0.2s',
                        style({opacity: 1, transform: 'translateX(0)'},
                        ))),
                ], {optional: true}),
            ]),
        ]),
        ...HeightToggleAnimation,
    ],
})
export class TableComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: Params.ITableCParams;

    public $params: Params.ITableCParams;
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
        protected cdr: ChangeDetectorRef,
        protected injector: Injector,
        protected configService: ConfigService,
        protected actionService: ActionService,
        @Inject(WINDOW) protected window: Window,
    ) {
        super(
            <IMixedParams<Params.ITableCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public async ngOnInit(): Promise<void> {
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

        this.itemPerPage = this.$params.pageCount;
        this.theme = this.$params.theme;
        this.prepareHead();
        if (this.$params.rows instanceof BehaviorSubject) {
            this.$params.rows.pipe(takeUntil(this.$destroy)).subscribe((rows) => {
                this.rows = this.createTableRow(rows);
                this.indexFactor = 0;
                this.paginatedRows = this.rows?.slice(0, this.itemPerPage);
                this.cdr.markForCheck();
            });
        } else {
            this.rows = this.createTableRow(this.$params.rows);
        }

        const columnWithComponent = _filter(this.head, (item) => item.type === 'component' && !item.componentClass);

        if (columnWithComponent?.length) {
            const componentsLoadPromises = [];
            _uniq(columnWithComponent.map((item) => item.component)).forEach(async (component) => {
                componentsLoadPromises.push(
                    (async () => {
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

        this.paginatedRows = this.rows?.slice(0, this.itemPerPage);
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
        this.cdr.markForCheck();
    }

    public toggleRows(): void {
        if(this.toggled) {
            this.paginatedRows = this.rows?.slice(0, this.itemPerPage);
        } else {
            this.paginatedRows = this.rows;
        }
        this.toggled = !this.toggled;
    }

    private createTableRow(rows: unknown[]): TableRowModel[] {
        return rows.map((row) => new TableRowModel(row, this.$params));
    }

    private prepareHead(): void {
        this.head = _sortBy(this.$params.head.map((item: Params.ITableCol) => {
            if (item.type === 'amount') {
                item.type = 'component';
                item.component = 'core.wlc-currency';
            }
            item.order = item.order || Number.MAX_SAFE_INTEGER;
            return item;
        }), 'order');
    }
}
