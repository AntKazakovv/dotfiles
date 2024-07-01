import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
} from '@angular/core';

import {
    BehaviorSubject,
    takeUntil,
} from 'rxjs';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {IGamesGridCParams} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';
import {SearchControllerDefault} from 'wlc-engine/modules/games/components/search-v2';

import * as Params from './search-result.params';

@Component({
    selector: '[wlc-search-result]',
    templateUrl: './search-result.component.html',
    styleUrls: ['./styles/search-result.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultComponent extends AbstractComponent implements OnInit {
    public searchQuery$: BehaviorSubject<string> = new BehaviorSubject('');
    protected gamesGridParams: IGamesGridCParams;

    constructor(
        @Inject (SearchControllerDefault) protected $searchControllerDefault: SearchControllerDefault,
        configService: ConfigService,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.subscribeSearchQuery();
        this.gamesGridParams = this.$searchControllerDefault.props.gamesGridParams;
    }

    public subscribeSearchQuery(): void {
        this.$searchControllerDefault.searchQuery$()
            .pipe(
                takeUntil(this.$destroy),
            )
            .subscribe((value)=> {
                this.searchQuery$.next(value);
            });
    }
}
