import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
} from '@angular/core';

import {takeUntil} from 'rxjs';

import {AbstractComponent} from 'wlc-engine/modules/core';
import {SearchControllerEasy} from 'wlc-engine/modules/games/components/search-v2';
import {openCloseAnimations} from 'wlc-engine/modules/games/system/animations/search.animations';

import * as Params from './search-last-queries.params';

@Component({
    selector: '[wlc-search-last-queries]',
    templateUrl: './search-last-queries.component.html',
    styleUrls: ['./styles/search-last-queries.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [openCloseAnimations],
})
export class SearchLastQueriesComponent extends AbstractComponent implements OnInit {
    public lastQueries: string[] = [];
    protected recentSearchText: string = this.$searchControllerEasy.props.recentSearchText;

    constructor(
        @Inject (SearchControllerEasy) protected $searchControllerEasy: SearchControllerEasy,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.getLastQueriesSubscribe();
    }

    public deleteQuery(event: MouseEvent, index: number): void {
        event.stopPropagation();
        this.$searchControllerEasy.setValueEventsLastQueries({event: 'delete', index: index});
    }

    public chooseQuery(index: number): void {
        this.$searchControllerEasy.setValueEventsLastQueries({event: 'choose', index: index});
    }

    public getLastQueriesSubscribe(): void {
        this.$searchControllerEasy.lastQueries$
            .pipe(
                takeUntil(this.$destroy),
            )
            .subscribe((value) => {
                this.lastQueries = value;
                this.cdr.markForCheck();
            });
    }
}
