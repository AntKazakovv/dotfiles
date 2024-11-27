import {
    Component,
    OnInit,
    Inject,
    Input,
    ChangeDetectionStrategy,
    Injector,
    Output,
    EventEmitter,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import _each from 'lodash-es/each';
import _filter from 'lodash-es/filter';
import _isObject from 'lodash-es/isObject';
import _uniq from 'lodash-es/uniq';
import _sortBy from 'lodash-es/sortBy';
import _map from 'lodash-es/map';

import {
    AbstractComponent,
    IMixedParams,
    InjectionService,
    ActionService,
    DeviceType,
    HeightToggleAnimation,
    TableAppearanceAnimation,
    TriggerNamesEnum,
    IPaginateOutput,
} from 'wlc-engine/modules/core';

import {GlobalHelper} from  'wlc-engine/modules/core/system/helpers/global.helper';
import {TableRowModel} from './table-row.model';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {WalletsService} from 'wlc-engine/modules/multi-wallet/system/services/wallets.service';

import * as Params from './table.params';

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
    @Output() public changePage: any = new EventEmitter();

    public override $params: Params.ITableCParams;
    public rows: TableRowModel[] = [];
    public paginatedRows: TableRowModel[] = [];
    public itemPerPage: number;
    public head: Params.ITableCol[] = [];
    public ready: boolean = false;
    public deviceType: DeviceType;
    public indexFactor: number = 0;
    public tableType: Params.TableTypeEnum = Params.TableTypeEnum.TABLE;
    public headDescriptions: string[] = [];
    public walletsService: WalletsService;

    readonly isMultiWalletOn: boolean = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');

    public theme: Params.Theme;
    public toggled: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.ITableCParams,
        protected injectionService: InjectionService,
        protected injector: Injector,
        protected actionService: ActionService,
        @Inject(WINDOW) protected window: Window,
    ) {
        super(
            <IMixedParams<Params.ITableCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        if (this.isMultiWalletOn) {
            this.configService.get<BehaviorSubject<boolean>>('$user.isAuth$')
                .subscribe(async (isAuth: boolean): Promise<void> => {

                    if (isAuth) {
                        this.walletsService ??=
                            await this.injectionService.getService<WalletsService>('multi-wallet.wallet-service');
                    }

                });
        }

        const mediaQueryList: MediaQueryList = this.window.matchMedia(`(min-width: ${this.$params.switchWidth}px)`);
        this.calcTableType(mediaQueryList);
        GlobalHelper.mediaQueryObserver(mediaQueryList)
            .pipe(takeUntil(this.$destroy))
            .subscribe(this.calcTableType.bind(this));

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

        const columnWithComponent: Params.ITableCol[] = _filter(
            this.head,
            (item: Params.ITableCol) => item.type === 'component' && !item.componentClass,
        );

        if (columnWithComponent?.length) {
            const componentsLoadPromises: Promise<unknown>[] = [];
            _uniq(columnWithComponent
                .map((item: Params.ITableCol) => item.component))
                .forEach((component: string): void => {
                    componentsLoadPromises.push(
                        (async (): Promise<void> => {
                            const componentClass = await this.injectionService.loadComponent(component);
                            _each(columnWithComponent, (item: Params.ITableCol): void => {
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

    public get isTable(): boolean {
        return this.tableType === Params.TableTypeEnum.TABLE;
    }

    public get isMobile(): boolean {
        return this.tableType === Params.TableTypeEnum.MOBILE;
    }

    public get appearanceState(): string | number | TableRowModel[] {
        return this.$params.disableAppearanceAnimation
            ? 'no-animation'
            : (this.indexFactor || this.rows);
    }

    public calcTableType(mediaQueryResult: MediaQueryList | MediaQueryListEvent): void {
        this.removeModifiers(this.tableType);

        if (mediaQueryResult.matches || this.$params.disableMobileVersion) {
            this.tableType = Params.TableTypeEnum.TABLE;
        } else {
            this.tableType = Params.TableTypeEnum.MOBILE;
        }

        this.addModifiers(this.tableType);
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

    public animationStatus(item: TableRowModel, first: boolean): string {
        return first || item.opened || this.isTable ?
            TriggerNamesEnum.OPENED :
            TriggerNamesEnum.CLOSED;
    }

    protected subscribeDeviceChange(): void {
        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType): void => {
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
        let amountPages = Math.ceil(this.rows.length / this.itemPerPage);
        if (value.event.page === amountPages || this.$params.scrollUp) {
            this.actionService.scrollTo('body');
        }

        this.indexFactor = (value.event.page - 1) * value.event.itemsPerPage;
        this.setPaginatedRowsModifier();
        this.changePage.emit({value: value.event.page});
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

    private createTableRow(rows: unknown[]): TableRowModel[] {
        return rows.map((row) => {
            const isOpened: boolean = this.rows.some(
                (oldRow: TableRowModel) => oldRow['id'] === row['id'] && oldRow.opened,
            );

            return new TableRowModel(this.walletsService, row, this.$params, isOpened);
        });
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
                item.component = 'core.wlc-currency';

                if (this.isMultiWalletOn && item.useCurrencyIcon) {
                    item.useCurrencyIcon = true;
                } else {
                    item.useCurrencyIcon = false;
                }
            }
            item.order = item.order || Number.MAX_SAFE_INTEGER;
            return item;
        }), 'order');

        this.headDescriptions = _map(
            _filter(this.head, 'description'),
            (headCell: Params.ITableCol) => headCell.description,
        );
    }
}
