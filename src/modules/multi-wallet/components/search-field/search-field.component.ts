import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {AbstractComponent} from 'wlc-engine/modules/core';

import * as Params from './search-field.params';

@Component({
    selector: '[wlc-search-field]',
    templateUrl: './search-field.component.html',
    styleUrls: ['./styles/search-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SearchFieldComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ISearchFieldCParams;
    @Output() public searchQueryEmit: EventEmitter<string> = new EventEmitter();
    public searchQuery: string = '';
    public searchQuery$: Subject<string> = new Subject();
    public override $params: Params.ISearchFieldCParams;

    protected disabledSymbols: RegExp = /[$%*;<=>?@\^{|}~№]/gi;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISearchFieldCParams,
    ) {
        super({
            injectParams: injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.searchQuery$
            .pipe(
                takeUntil(this.$destroy),
            )
            .subscribe((query: string) => {
                this.emitSearch(query);
            });
    }

    public emitSearch(query: string): void {
        this.searchQueryEmit.emit(query);
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

    public clearSearch(): void {
        this.searchQuery = '';
        this.searchQuery$.next('');
    }

    /**
     * Show clear icon
     *
     * @return {boolean}
     */
    public get showClear(): boolean {
        return !this.searchQuery.length;
    }

    /**
     * Show search icon
     *
     * @return {boolean}
     */
    public get showSearch(): boolean {
        return !!this.searchQuery.length;
    }
    private processSearchString(str: string): void {
        this.searchQuery = str
            .trim()
            .replace(/\s+/gi, ' ')
            .replace(this.disabledSymbols, '');

        this.searchQuery$.next(this.searchQuery);
    }
}
