import {
    Injectable,
    inject,
    DestroyRef,
} from '@angular/core';

import {
    BehaviorSubject,
    Observable,
    Subject,
} from 'rxjs';

import {
    GlobalHelper,
    TDeepReadonly,
} from 'wlc-engine/modules/core';
import {ISearchFieldCParams} from 'wlc-engine/modules/games/components/search-field/search-field.params';
import {GamesFilterService} from 'wlc-engine/modules/games/system/services/games-filter.service';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';

@Injectable()
export abstract class AbstractSearchController<T> {
    public props!: TDeepReadonly<T>;

    protected readonly controllerReady = new Promise(resolve => this.$resolveReady = resolve);
    protected $destroy: Subject<void> = new Subject();
    protected destroyRef = inject(DestroyRef);
    protected readonly gamesCatalogService: GamesCatalogService = inject(GamesCatalogService);
    protected readonly gamesFilterService: GamesFilterService = inject(GamesFilterService);
    protected searchFieldCParams!: ISearchFieldCParams;
    protected $resolveReady: (v?: unknown) => void;

    private _searchQuery$: BehaviorSubject<string> = new BehaviorSubject('');

    public init(paramsController: T): void {
        this.props = paramsController;
        GlobalHelper.deepFreeze(this.props);
        this.destroyRef.onDestroy(() => this.destroy());
    }

    public searchQuery$(): Observable<string> {
        return this._searchQuery$.asObservable();
    }

    public set searchQuery(value: string) {
        this._searchQuery$.next(value);
    }

    public get searchQuery(): string {
        return this._searchQuery$.getValue();
    }

    public destroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }
}
