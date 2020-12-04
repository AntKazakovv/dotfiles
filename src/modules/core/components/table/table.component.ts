import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    Input,
    ChangeDetectionStrategy,
    Injector,
} from '@angular/core';
import {AbstractComponent, IMixedParams} from 'wlc-engine/classes/abstract.component';
import {LayoutService} from 'wlc-engine/modules/core/services';
import {BehaviorSubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TableRowModel} from './table-row.model';
import * as Params from './table.params';

import {
    get as _get,
    each as _each,
    filter as _filter,
    find as _find,
    isObject as _isObject,
    uniq as _uniq,
    sortBy as _sortBy,
} from 'lodash';

@Component({
    selector: '[wlc-table]',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: Params.ITableParams;

    public $params: Params.ITableParams;
    public rows: TableRowModel[] = [];
    public head: Params.ITableCol[] = [];
    public ready = false;

    constructor(
        @Inject('injectParams') protected params: Params.ITableParams,
        protected layoutService: LayoutService,
        protected cdr: ChangeDetectorRef,
        protected injector: Injector,
    ) {
        super(
            <IMixedParams<Params.ITableParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.prepareHead();

        if (this.$params.rows instanceof BehaviorSubject) {
            this.$params.rows.pipe(takeUntil(this.$destroy)).subscribe((rows) => {
                this.rows = this.createTableRow(rows);
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
                        const componentClass = await this.layoutService.loadComponent(component);
                        _each(columnWithComponent, (item) => {
                            if (item.component === component) {
                                item.componentClass = componentClass;
                            }
                        });
                        return;
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
    }

    public getComponentInjector(item: TableRowModel, col: Params.ITableCol): Injector {
        if (!item.paramsInjector[col.key]) {
            const value = item.getValue(col) || {};
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

    private createTableRow(rows: unknown[]): TableRowModel[] {
        return rows.map((row) => new TableRowModel(row, this.$params));
    }

    private prepareHead(): void {
        this.head = _sortBy(this.$params.head.map((item) => {
            if (item.type === 'amount') {
                item.type = 'component';
                item.component = 'core.wlc-dummy-amount';
            };
            item.order = item.order || Number.MAX_SAFE_INTEGER;
            return item;
        }), 'order');
    }
}
