import {
    Component,
    Inject,
    Input,
    OnInit,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';

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
export class SearchFieldComponent extends AbstractComponent implements OnInit {

    public searchQuery: string;
    public $params: ISearchFieldCParams;

    @Input() protected inlineParams: ISearchFieldCParams;
    protected disabledSimbols: RegExp = /[;\\~$%^*\[\]{}+=|?№<>!@]/gi;

    constructor(
        @Inject('injectParams') protected injectParams: ISearchFieldCParams,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected gamesFilterService: GamesFilterService,
        protected configService: ConfigService,
    ){
        super({
            injectParams: injectParams,
            defaultParams: defaultParams,
        }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public changeSearch(): void {
        this.searchQuery = this.searchQuery
            .trim()
            .replace(/\s+/gi, ' ')
            .replace(this.disabledSimbols, '');

        this.emitSearch();
    }

    public clearSearch(): void {
        this.searchQuery = '';
        this.emitSearch();
    }

    protected emitSearch(): void {
        this.gamesFilterService.search(
            this.$params.searchFrom,
            this.searchQuery,
        );
    }

}
