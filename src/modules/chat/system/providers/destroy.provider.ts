import {Observable, ReplaySubject} from 'rxjs';
import {Injectable, OnDestroy} from '@angular/core';


@Injectable()
export class DestroyProvider extends Observable<void> implements OnDestroy {

    private readonly destroySubject$ = new ReplaySubject<void>(1);

    constructor() {
        super(subscriber => this.destroySubject$.subscribe(subscriber));
    }

    public ngOnDestroy(): void {
        this.destroySubject$.next();
        this.destroySubject$.complete();
    }
}
