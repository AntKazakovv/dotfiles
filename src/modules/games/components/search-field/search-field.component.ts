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
import {debounceTime, map, takeUntil} from 'rxjs/operators';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core/system/services';
import {GamesFilterService} from 'wlc-engine/modules/games';
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

    @ViewChild('searchField') searchField: ElementRef;

    @Input() protected inlineParams: ISearchFieldCParams;

    @Output() public searchQueryEmit = new EventEmitter();

    public searchQuery: string;
    public searchQuery$: Subject<Event> = new Subject();
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
                takeUntil(this.$destroy),
                debounceTime(500),
                map((event: Event) => {
                    return (event.target as HTMLInputElement).value
                        .trim()
                        .replace(/\s+/gi, ' ')
                        .replace(this.disabledSymbols, '');
                }),
            )
            .subscribe((query: string) => {
                this.emitSearch(query);
            });

        if (!this.inlineParams.searchQueryFromCache) {
            return;
        }

        this.searchQuery = this.inlineParams.searchQueryFromCache;
        this.emitSearch(this.searchQuery);
    }

    public ngAfterViewInit(): void {
        if (this.$params.focus) {
            setTimeout(() => {
                this.searchField.nativeElement.focus();
            }, 1000);
        }
    }

    public clearSearch(): void {
        this.emitSearch('');
        this.searchQuery = '';
    }

    public emitSearch(query: string): void {
        this.gamesFilterService.search(
            this.$params.searchFrom,
            query,
        );
        this.searchQueryEmit.emit(query);
    }
}
