import {
    Component,
    Inject,
    Input,
    OnInit,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    Output,
    EventEmitter,
    AfterViewInit,
    ElementRef,
    ViewChild,
} from '@angular/core';

import {Subject} from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    takeUntil,
} from 'rxjs/operators';

import {
    ConfigService,
    EventService,
    AbstractComponent,
} from 'wlc-engine/modules/core';
import {GamesFilterService} from 'wlc-engine/modules/games/system/services/games-filter.service';
import {
    ISearchFieldCParams,
    defaultParams,
} from './search-field.params';

@Component({
    selector: '[wlc-search-field]',
    templateUrl: './search-field.component.html',
    styleUrls: ['./styles/search-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldComponent extends AbstractComponent implements OnInit, AfterViewInit {
    @Input() public set searchQueryInput(data: string) {
        setTimeout((): void => {
            this.processSearchString(data);
        });
    };

    @Output() public searchQueryEmit: EventEmitter<string> = new EventEmitter();
    @Output() public searchBlur: EventEmitter<string> = new EventEmitter();
    @Output() public enterEmit: EventEmitter<string> = new EventEmitter();
    @Output() public clickEmit: EventEmitter<Event> = new EventEmitter();
    @Input() protected showClearIcon: boolean = true;
    @Input() protected inlineParams: ISearchFieldCParams;
    @ViewChild('searchField') protected searchField: ElementRef<HTMLInputElement>;
    public searchQuery: string = '';
    public searchQuery$: Subject<string> = new Subject();
    public $params: ISearchFieldCParams;

    protected disabledSymbols: RegExp = /[$%*;<=>?@\^{|}~№]/gi;

    constructor(
        @Inject('injectParams') protected injectParams: ISearchFieldCParams,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected gamesFilterService: GamesFilterService,
        protected configService: ConfigService,
    ) {
        super({
            injectParams: injectParams,
            defaultParams: defaultParams,
        }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.searchQuery$
            .pipe(
                distinctUntilChanged(),
                debounceTime(this.$params.debounceTime),
                takeUntil(this.$destroy),
            )
            .subscribe((query: string) => {
                this.emitSearch(query);
            });

        if (this.inlineParams.searchQueryFromCache) {
            this.searchQuery = this.inlineParams.searchQueryFromCache;
            this.emitSearch(this.searchQuery);
            this.processSearchStringLength();
        }
    }

    public ngAfterViewInit(): void {
        if (this.$params.focus) {
            setTimeout(() => {
                this.searchField.nativeElement.focus();
            }, 1000);
        }
    }

    /**
     * Show search icon
     * 
     * @return {boolean}
     */
    public get showSearch(): boolean {
        if (this.$params.isDropdown) {
            return (this.searchQuery?.length && !this.showClearIcon) || !this.searchQuery?.length;
        } else {
            return true;
        }
    }

    /**
     * Show clear icon
     * 
     * @return {boolean}
     */
    public get showClear(): boolean {
        return this.searchQuery?.length && this.showClearIcon;
    }

    public clearSearch(): void {
        this.emitSearch('');
        this.searchQuery = '';
        this.processSearchStringLength();
    }

    public emitSearch(query: string): void {
        const emitQuery: string | null = this.$params.emitNullQuery ? query || null : query;

        this.gamesFilterService.search(
            this.$params.searchFrom,
            emitQuery,
        );

        this.searchQueryEmit.emit(query);
    }

    /**
     * Keyup handler
     */
    public onKeyUp(): void {
        this.enterEmit.emit(this.searchQuery);
        this.searchField.nativeElement.blur();
    }

    /**
     * Input handler and process search string
     * @param event Event
     */
    public inputHandler(event: Event): void {
        if (event.target instanceof HTMLInputElement) {
            this.processSearchString(event.target.value);
        }
    }

    protected processSearchString(string: string): void {
        this.searchQuery = string
            .trim()
            .replace(/\s+/gi, ' ')
            .replace(this.disabledSymbols, '');

        this.searchQuery$.next(this.searchQuery);
        this.processSearchStringLength();
    }

    protected processSearchStringLength(): void {
        this.searchQuery ? this.addModifiers('close-icon-showed') : this.removeModifiers('close-icon-showed');
    }
}
