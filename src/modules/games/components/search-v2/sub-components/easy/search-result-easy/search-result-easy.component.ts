import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    ChangeDetectorRef,
    inject,
} from '@angular/core';

import {takeUntil} from 'rxjs';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {SearchControllerEasy} from 'wlc-engine/modules/games/components/search-v2';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {IGamesGridCParams} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';

import * as Params from './search-result-easy.params';

@Component({
    selector: '[wlc-search-result-easy]',
    templateUrl: './search-result-easy.component.html',
    styleUrls: ['./styles/search-result-easy.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultEasyComponent extends AbstractComponent implements OnInit {
    protected visibleGames: Game[];
    protected searchQuery: string;
    protected override readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

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
        this.initSubscriptions();
    }

    public initSubscriptions(): void {
        this.$searchControllerEasy.visibleGames$
            .pipe(takeUntil(this.$destroy))
            .subscribe((value: Game[]) => {
                this.visibleGames = value;
                this.cdr.markForCheck();
            });

        this.$searchControllerEasy.searchQuery$()
            .pipe(takeUntil(this.$destroy))
            .subscribe((value: string) => {
                this.searchQuery = value;
                this.cdr.markForCheck();
            });
    }

    public get fieldWasClicked(): boolean {
        return this.$searchControllerEasy.fieldWasClicked;
    }

    public get showSecondBlock(): boolean {
        return this.$searchControllerEasy.showSecondBlock;
    }

    public get emptyText(): string {
        return this.$searchControllerEasy.props.emptyText;
    }

    public get secondGamesGridParams(): IGamesGridCParams {
        return this.$searchControllerEasy.props.secondBlock.gamesGrid;
    }

    public get gamesGridParams(): IGamesGridCParams {
        return this.$searchControllerEasy.props.gamesGridParams;
    }
}
