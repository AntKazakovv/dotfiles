import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    ElementRef,
} from '@angular/core';

import {
    BehaviorSubject,
    takeUntil,
} from 'rxjs';

import {AbstractComponent} from 'wlc-engine/modules/core';
import {IGamesGridCParams} from 'wlc-engine/standalone/games/components/games-grid/games-grid.params';
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
    public gamesGridScrollHost: ElementRef;
    protected gamesGridParams: IGamesGridCParams;

    constructor(
        @Inject (SearchControllerDefault) protected $searchControllerDefault: SearchControllerDefault,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.subscribeSearchQuery();
        this.gamesGridScrollHost = this.$searchControllerDefault.modalHost;
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
