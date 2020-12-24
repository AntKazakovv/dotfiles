import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    Input,
    ChangeDetectionStrategy,
    Injector,
} from '@angular/core';

import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {HeightToggleAnimation} from 'wlc-engine/modules/core/system/animations/height-toggle.animation';
import {LayoutService} from 'wlc-engine/modules/core/system/services';
import {ActionService, ConfigService, DeviceModel, IDeviceConfig, DeviceType} from 'wlc-engine/modules/core';
import {BehaviorSubject} from 'rxjs';
import {takeUntil, filter} from 'rxjs/operators';
import {TableRowModel} from './table-row.model';
import * as Params from './table.params';

import {
    each as _each,
    filter as _filter,
    isObject as _isObject,
    uniq as _uniq,
    sortBy as _sortBy,
} from 'lodash';

@Component({
    selector: '[wlc-table]',
    templateUrl: './table.component.html',
    styleUrls: ['./styles/table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: HeightToggleAnimation,
})
export class TableComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: Params.ITableCParams;

    public $params: Params.ITableCParams;
    public rows: TableRowModel[] = [];
    public head: Params.ITableCol[] = [];
    public ready = false;
    public deviceType: DeviceType;

    constructor(
        @Inject('injectParams') protected params: Params.ITableCParams,
        protected layoutService: LayoutService,
        protected cdr: ChangeDetectorRef,
        protected injector: Injector,
        protected configService: ConfigService,
        private actionService: ActionService,
    ) {
        super(
            <IMixedParams<Params.ITableCParams>>{
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
        this.subscribeDeviceChange();
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

    public animationStatus(col: Params.ITableCol, item: TableRowModel, first: boolean): string {
        return (col.disableHideClass || first) || item.opened || this.deviceType === DeviceType.Desktop ? 'opened' : 'closed';
    }

    private createTableRow(rows: unknown[]): TableRowModel[] {
        return rows.map((row) => new TableRowModel(row, this.$params));
    }

    private prepareHead(): void {
        this.head = _sortBy(this.$params.head.map((item: Params.ITableCol) => {
            if (item.type === 'amount') {
                item.type = 'component';
                item.component = 'core.wlc-dummy-amount';
            }
            item.order = item.order || Number.MAX_SAFE_INTEGER;
            return item;
        }), 'order');
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
