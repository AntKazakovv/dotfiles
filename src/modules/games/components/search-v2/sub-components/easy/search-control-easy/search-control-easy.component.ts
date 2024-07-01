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
import {SearchControllerEasy} from 'wlc-engine/modules/games/components/search-v2';
import {ISearchFieldCParams} from 'wlc-engine/modules/games/components/search-field/search-field.params';

import * as Params from './search-control-easy.params';

@Component({
    selector: '[wlc-search-control-easy]',
    templateUrl: './search-control-easy.component.html',
    styleUrls: ['./styles/search-control-easy.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchControlEasyComponent extends AbstractComponent implements OnInit {
    protected searchQuery$: BehaviorSubject<string> = new BehaviorSubject('');
    protected searchParams: ISearchFieldCParams;

    constructor(
        @Inject (SearchControllerEasy) protected $searchControllerEasy: SearchControllerEasy,
        configService: ConfigService,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.searchParams = this.$searchControllerEasy.searchParams;
        this.setSubscribeSearchQuery();
    }

    public setSubscribeSearchQuery(): void {
        this.$searchControllerEasy.searchQuery$()
            .pipe(takeUntil(this.$destroy))
            .subscribe((value: string) => {
                this.searchQuery$.next(value);
            });
    }

    public setSearchQuery(event: string): void {
        this.$searchControllerEasy.searchQuery = event;
    }

    public addLastQueries(query: string, delay: number = 0): void {
        setTimeout((): void => {
            this.$searchControllerEasy.addLastQueries(query);
        }, delay);
    }

    public handleClickSearchField(): void {
        this.$searchControllerEasy.fieldWasClicked = true;
    }
}
