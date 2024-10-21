import {
    Injectable,
    inject,
} from '@angular/core';

import {
    StateDeclaration,
    StateService,
    TargetState,
    Transition,
    TransitionService,
    UIRouter,
    UIRouterGlobals,
    UrlService,
} from '@uirouter/core';
import {
    BehaviorSubject,
    Observable,
    Subject,
} from 'rxjs';

import {
    TLinkStateName,
    TLinkStateParams,
} from 'wlc-engine/modules/core/directives/link/link.interfaces';
import {
    ICurrentState,
    TLifecycleEvent,
} from 'wlc-engine/modules/core/system/services/router/types';

@Injectable({
    providedIn: 'root',
})
export class RouterService {

    private readonly uiRouter = inject(UIRouter);
    private readonly stateService = inject(StateService);
    private readonly routerGlobals = inject(UIRouterGlobals);
    private readonly transitionService = inject(TransitionService);

    private readonly currentState$ = new BehaviorSubject<ICurrentState | null>(null);
    private readonly lifecycle$ = new Subject<TLifecycleEvent>();

    constructor() {
        this.init();
    }

    public get current(): ICurrentState {
        return this.currentState$.getValue();
    }

    public get stateChange$(): Observable<ICurrentState> {
        return this.currentState$.asObservable();
    }

    public get events$(): Observable<TLifecycleEvent> {
        return this.lifecycle$.asObservable();
    }

    public get urlService(): UrlService {
        return this.uiRouter.urlService;
    }

    /** @deprecated */
    public get transition(): any {
        return this.routerGlobals.transition;
    }

    public navigate(state: TLinkStateName, params?: TLinkStateParams, options?: any): Promise<any> {
        return this.stateService.go(state, params, options);
    }

    public reload(): Promise<any> {
        return this.stateService.reload();
    }

    public get(): StateDeclaration[] {
        return this.stateService.get();
    }

    public is(state: TLinkStateName, stateParams?: TLinkStateParams): boolean {
        return this.stateService.is(state, stateParams);
    }

    public href(state: TLinkStateName, params?: TLinkStateParams, options?: any): string {
        return this.stateService.href(state, params, options);
    }

    public target(state: TLinkStateName, params?: TLinkStateParams, options?: any): TargetState {
        return this.stateService.target(state, params, options);
    }

    private init(): void {
        this.setCurrentState();
        this.lifecycleListeners();
    }

    private setCurrentState(): void {
        this.currentState$.next({
            alias: this.routerGlobals.current.name,
            params: this.routerGlobals.params,
            url: this.href(this.routerGlobals.current.name, this.routerGlobals.params),
        });
    }

    private lifecycleListeners(): void {
        this.transitionService.onBefore({}, (transition: Transition) => {
            this.lifecycle$.next({
                name: 'onBefore',
                transition,
            });
        });

        this.transitionService.onEnter({}, (transition: Transition, state: StateDeclaration) => {
            this.lifecycle$.next({
                name: 'onEnter',
                transition,
                state,
            });
        });

        this.transitionService.onExit({}, (transition: Transition, state: StateDeclaration) => {
            this.lifecycle$.next({
                name: 'onExit',
                transition,
                state,
            });
        });

        this.transitionService.onStart({}, (transition: Transition) => {
            this.lifecycle$.next({
                name: 'onStart',
                transition,
            });
        });

        this.transitionService.onFinish({}, (transition: Transition) => {
            this.lifecycle$.next({
                name: 'onFinish',
                transition,
            });
        });

        this.transitionService.onSuccess({}, (transition: Transition) => {
            this.setCurrentState();
            this.lifecycle$.next({
                name: 'onSuccess',
                transition,
            });
        });
    }
}
