import {
    Input,
    Inject,
    OnInit,
    Output,
    Component,
    OnChanges,
    EventEmitter,
    ChangeDetectorRef,
} from '@angular/core';
import {PageChangedEvent} from 'ngx-bootstrap/pagination';
import {takeUntil} from 'rxjs/operators';

import {
    IMixedParams,
    GlobalHelper,
    AbstractComponent,
} from 'wlc-engine/modules/core';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './pagination.params';

import _keys from 'lodash-es/keys';
import _each from 'lodash-es/each';

@Component({
    selector: '[wlc-pagination]',
    templateUrl: './pagination.component.html',
    styleUrls: ['./styles/pagination.component.scss'],
})
export class WlcPaginationComponent<T = unknown> extends AbstractComponent implements OnInit, OnChanges {
    @Input() theme: Params.ComponentTheme;
    @Input() totalItems: number;
    @Input() pageChanged: Function;
    @Input() itemPerPage: number = 1;
    @Input() items: T[];
    @Input() settings: Params.IPagination;

    @Output() public paginationOnChange = new EventEmitter<Params.IPaginateOutput<T>>();

    public $params: Params.IPaginationCParams;
    public currentPage: number = 1;

    protected paginatedItems: T[];

    constructor(
        @Inject('injectParams') protected params: Params.IPaginationCParams,
        protected cdr: ChangeDetectorRef,
        @Inject(WINDOW) private window: Window,
    ) {
        super(
            <IMixedParams<Params.IPaginationCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public ngOnChanges(): void {
        if (!this.pageChanged) {
            this.pageChanged = this.pageChangedDefault;
        }

        if (this.items?.length) {
            this.totalItems = this.items.length;
            this.resetPage();
        }
    }

    public ngOnInit(): void {
        super.ngOnInit();

        if (this.settings?.breakpoints) {
            this.followBreakpoints();
        }

        this.resetPage();
    }

    /**
     *
     * Checks conditions for hiding a `wlc-pagination` component
     * @returns {boolean} boolean
     */
    public get hiddenPagination(): boolean {
        return !this.items || !this.settings?.use || (this.items.length <= this.itemPerPage);
    }

    /**
     * Default method for bind `pageChanged` event
     *
     * @method pageChangedDefault
     * @param {PageChangedEvent} event - event for change page
     * @returns void
     *
     * It is possible to override the method by passing a event `pageChanged`
     */
    protected pageChangedDefault(event: PageChangedEvent): void {
        const startItem = (event.page - 1) * event.itemsPerPage;
        const endItem = event.page * event.itemsPerPage;
        this.paginatedItems = this.items.slice(startItem, endItem);
        this.paginationEmit(event);
    }

    // TODO - Change `followBreakpoints` to global helper method
    /**
     * The method subscribes to resizing the window depending on this determines the parameter `itemPerPage`
     *
     * @method followBreakpoints
     * @returns void
     */
    protected followBreakpoints(): void {
        const breakpoints: string[] = _keys(this.settings.breakpoints);

        _each(breakpoints, (breakpoint: string, index: number) => {
            const mediaQuery = this.window.matchMedia(`(min-width: ${breakpoint}px)`);

            if (mediaQuery.matches) {
                this.itemPerPage = this.settings.breakpoints[breakpoint].itemPerPage;
                this.resetPage();
            }

            GlobalHelper.mediaQueryObserver(mediaQuery)
                .pipe(takeUntil(this.$destroy))
                .subscribe((event: MediaQueryListEvent) => {
                    const key = breakpoints[index];
                    const keyPrev = breakpoints[index - 1];
                    let perPage: number;

                    if (event.matches) {
                        perPage = this.settings.breakpoints[key].itemPerPage;
                    } else if (keyPrev) {
                        perPage = this.settings.breakpoints[keyPrev].itemPerPage;
                    }

                    if (perPage !== this.itemPerPage) {
                        this.itemPerPage = perPage;
                        this.resetPage();
                    }
                });
        });
    }

    /**
     * The method raises the `emit` event and transfers data from the component
     *
     * @method paginationEmit
     * @param {PageChangedEvent} event - event for change page
     * @returns void
     */
    protected paginationEmit(event: PageChangedEvent): void {
        this.paginationOnChange.emit({
            paginatedItems: this.paginatedItems,
            event,
        });
    }

    /**
     * Change the current page on the first page
     *
     * @method resetPage
     * @returns void
     */
    protected resetPage():void {
        this.cdr.detectChanges();
        this.currentPage = 1;
        this.pageChanged({page: 1, itemsPerPage: this.itemPerPage});
    }
}
